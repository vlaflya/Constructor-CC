
import { _decorator, Component, Node, Prefab, UITransform, CCFloat, instantiate, Vec2, Vec3, randomRange, math, find, ScrollView, SkeletalAnimation, sp, randomRangeInt, Camera, tween } from 'cc';
import { Island } from './Island';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('LevelMap')
export class LevelMap extends Component {
    @property({type: Prefab}) islandPrefab: Prefab
    @property({type: UITransform}) container: UITransform
    @property({type: CCFloat}) distance: number

    @property({type: Prefab}) backStone: Prefab
    @property({type: Node}) backContainer: Node

    @property({type: Prefab}) frontStone: Prefab
    @property({type: Node}) frontContainer: Node

    @property({type: ScrollView}) scroll: ScrollView
    @property({type: Node}) view: Node

    @property({type: Camera}) camera: Camera
    @property({type: Node}) background: Node


    start(){
        //this.scroll.node.on("scrolling", (() =>  {this.scrollCallback()}))
        let manager: GameManager = find("GameManager").getComponent(GameManager)
        manager.mapLoad()
    }

    scrollCallback(){
        let viewpos = new Vec3(this.view.position)
        this.backContainer.position = viewpos.multiplyScalar(0.5)
        this.frontContainer.position = viewpos.multiplyScalar(4)
    }

    update(){
        this.scrollCallback()
        let bgPos: Vec3 = new Vec3(this.camera.node.position)
        bgPos.y = 0
        bgPos.z = 0
        this.background.position = bgPos
    }

    init(count: number, lastLevel: number = 0, levelsUnlocked: number, unlockNew: boolean){
        this.scroll.enabled = false
        for(let i = 0; i < count/3; i++){
            let bstone: Node = instantiate(this.backStone)
            bstone.parent = this.backContainer
            bstone.position = new Vec3(i*1300, -150,0)
        }
        for(let i = 0; i < count; i++){
            let fstone: Node = instantiate(this.frontStone)
            fstone.parent = this.frontContainer
            fstone.position = new Vec3(i*1000, -200,0)
            let r = randomRangeInt(0,3)
            let st: string
            switch(r){
                case(0):{
                    st = "StonesBig_Idle_1"
                    break
                }
                case(1):{
                    st = "StonesBig_Idle_2"
                    break
                }
                case(2):{
                    st = "StonesBig_Idle_3"
                    break
                }
            }
            fstone.getComponent(sp.Skeleton).setAnimation(0,st, true)
        }
        this.container.width = (count + 1) * this.distance
        let m = 1
        for(let i = 0; i < count; i++){
            let island: Node = instantiate(this.islandPrefab)
            island.parent = this.container.node
            island.position = new Vec3((i + 1) * this.distance)
            island.position.add(new Vec3(0, (m * 50) + 30))
            let state: number
            if(i == levelsUnlocked)
                state = 0
            else if(i < levelsUnlocked)
                state = 1
            else
                state = 2
            island.getComponent(Island).init(i, state)
            m *= -1
        }
        this.container.node.position = new Vec3(-lastLevel * this.distance)
        this.scrollCallback()
        if(levelsUnlocked != (lastLevel + 1) || !unlockNew){
            console.log(levelsUnlocked + " " +lastLevel)
            this.scroll.enabled = true
            return
        }
        tween(this.container.node)
        .by(1, {position: new Vec3(Vec3.RIGHT).multiplyScalar(-this.distance/1.2)})
        .call(() => {this.scroll.enabled = true})
        .start()
    }
    focusOnIsland(pos: Vec3, id: number){
        tween(this.camera)
        .to(1, {orthoHeight: 150})
        .start()
        pos.z = 1000
        tween(this.camera.node)
        .to(1, {worldPosition: pos})
        .start()
        find("GameManager").getComponent(GameManager).transitionIn(id, pos)
    }
}

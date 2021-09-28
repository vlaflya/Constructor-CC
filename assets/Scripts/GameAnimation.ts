
import { _decorator, Component, Node, sp, Skeleton, tween, easing, Vec3 } from 'cc';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('GameAnimation')
export class GameAnimation extends Component {
    @property({type: sp.Skeleton}) flower: sp.Skeleton
    @property({type: sp.Skeleton}) platform: sp.Skeleton
    @property({type: sp.Skeleton}) zebra: sp.Skeleton
    @property({type: Node}) posPlatformUp: Node
    @property({type: Node}) posPlatform: Node
    @property({type: Node}) posFlowerUp: Node
    @property({type: Node}) posFlower: Node
    @property({type: Node}) flowerWaterfall: Node


    start(){
        this.setMix(this.flower, "Idle_1", "In" , 0.5)
        this.setMix(this.flower, "In", "Idle_2" , 0.5)
        this.setMix(this.platform, "In", "Begin", 0.5)
        this.setMix(this.zebra, "Constructor_Idle", "Constructor_Happy-2", 0.2)
        this.setMix(this.zebra, "Constructor_Idle", "Constructor_Jump", 0.1)
    }

    public endLevel(){
        this.platform.setAnimation(0,"In",false)
        SoundManager.Instance.setSound(this.platform.node, "PlatformUp", false ,true)
        tween(this.zebra.node)
        .delay(1)
        .call(()=> {this.zebra.setAnimation(0,"Constructor_Jump", true)})
        .to(0.5, {worldPosition: this.posPlatformUp.worldPosition}, {easing: "quadIn"})
        .to(0.5, {worldPosition: this.posPlatform.worldPosition}, {easing: "quadOut"})
        .call(()=> {
            this.zebra.setAnimation(0,"Constructor_Idle", true)
            SoundManager.Instance.setSound(this.zebra.node, "LandStones", false, true)
        })
        .delay(0.2)
        .call(()=> {this.zebra.setAnimation(0,"Constructor_Jump", true)})
        .to(0.5, {worldPosition: this.posFlowerUp.worldPosition}, {easing: "quadIn"})
        .to(0.5, {worldPosition: this.posFlower.worldPosition}, {easing: "quadOut"})
        .call(()=> {
            this.zebra.setAnimation(0,"Constructor_Idle", true)
            SoundManager.Instance.setSound(this.zebra.node, "LandStones", false, true)
        })
        .delay(0.2)
        .call(() => {this.callback()})
        .delay(1)
        .call(() => {this.flowerWaterfall.active = true})
        .start()
    }

    callback(){
        this.flower.setAnimation(0, "In", false)
        this.flower.addAnimation(0, "Idle_2", true)
        SoundManager.Instance.setSound(this.zebra.node, "HappyZebra", false, true)
        this.zebra.setAnimation(0, "Constructor_Happy-2", true)
    }

    setMix(skeleton: sp.Skeleton, anim1, anim2, transitionTime: number){
        skeleton.setMix(anim1, anim2, transitionTime)
        skeleton.setMix(anim2, anim1, transitionTime)
    }
}


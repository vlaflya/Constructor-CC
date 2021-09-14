
import { _decorator, Component, Node, Vec2, Vec3, CCFloat, random, randomRange, randomRangeInt, macro, tween, CCInteger, Tween } from 'cc';
import { FireflyController } from './FireflyController';

const { ccclass, property } = _decorator;

@ccclass('FireflyFreeRoamState')
export class FireflyFreeRoamState extends Component {
    
    @property({type: CCFloat}) speed: number
    @property({type: [Node]}) targets: Array<Node> = []
    @property({type: CCFloat}) maxDistance: number
    private speedTween: Tween<number>
    private startScale: number
    private currentTarget: Node
    private isInitialized: boolean = false
    bonusSpeed: number
    moveInsideSpeed: number = 1
    Initialize(points: Array<Node>){
        this.isInitialized = true
        this.targets = points
    }
    start(){
        this.ClosestPoint()
        this.MoveIn()
    }

    MoveIn(){
        this.moveInsideSpeed = 20
    }

    update(dt){
        this.node.setWorldPosition(this.node.worldPosition.lerp(this.currentTarget.worldPosition,dt * this.speed * this.moveInsideSpeed))
        if(Vec3.distance(this.node.worldPosition, this.currentTarget.worldPosition) < this.maxDistance){
            this.NextPoint()
        }
    }
    ClosestPoint(){
        this.startScale = this.node.getScale().x
        let closet: Node
        this.targets.forEach(elemet => {
            if(closet == null){
                closet = elemet
            }
            if(Vec3.distance(this.node.worldPosition, elemet.worldPosition) < Vec3.distance(this.node.worldPosition, closet.worldPosition)){
                closet = elemet
            }
        });
        this.currentTarget = closet
        if(this.currentTarget.position.x < this.node.position.x)
            this.node.setScale(this.startScale * -1, this.node.getScale().y, 1)
        else
            this.node.setScale(this.startScale, this.node.getScale().y, 1)
    }
    NextPoint(){
        this.moveInsideSpeed = 1
        this.startScale = this.node.getScale().x
        let tmp: Array<Node> = Array.from(this.targets)
        tmp.forEach((element,index)=>{
            if(element==this.currentTarget) tmp.splice(index,1);
         });
         this.currentTarget = this.targets[randomRangeInt(0, this.targets.length)]
         if(this.currentTarget.position.x < this.node.position.x)
            this.node.setScale(this.startScale * -1, this.node.getScale().y, 1)
         else
            this.node.setScale(this.startScale, this.node.getScale().y, 1)
    }
    
}


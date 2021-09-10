
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
    Initialize(points: Array<Node>){
        this.isInitialized = true
        this.targets = points
    }
    start(){
        
        this.NextPoint()
        //this.speedTween = tween(this.speed).to(0.5, this.speed * 100).delay(1).to(0.5, this.speed / 100)
    }
    update(dt){
        this.node.setWorldPosition(this.node.worldPosition.lerp(this.currentTarget.worldPosition,dt * this.speed))
        if(Vec3.distance(this.node.worldPosition, this.currentTarget.worldPosition) < this.maxDistance){
            this.NextPoint()
        }
    }
    NextPoint(){
        this.startScale = this.node.getScale().x
        let tmp: Array<Node> = Array.from(this.targets)
        tmp.forEach((element,index)=>{
            if(element==this.currentTarget) tmp.splice(index,1);
         });
         this.currentTarget = this.targets[randomRangeInt(0,this.targets.length)]
         if(this.currentTarget.position.x < this.node.position.x)
            this.node.setScale(this.startScale * -1, this.node.getScale().y, 1)
         else
            this.node.setScale(this.startScale, this.node.getScale().y, 1)
    }
    
}


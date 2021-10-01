
import { _decorator, Component, Node, Vec2, Vec3, CCFloat, random, randomRange, randomRangeInt, macro, tween, CCInteger, Tween, RigidBody2D, Collider2D, CircleCollider2D, find } from 'cc';
import { FireflyController } from './FireflyController';
import { SoundManager } from './SoundManager';

const { ccclass, property } = _decorator;

@ccclass('FireflyFreeRoamState')
export class FireflyFreeRoamState extends Component {
    
    @property({type: CCFloat}) speed: number
    @property({type: CCFloat}) moveInSpeed: number
    @property({type: [Node]}) targets: Array<Node> = []
    @property({type: CCFloat}) maxDistance: number
    @property({type: RigidBody2D}) rigidbody: RigidBody2D
    @property({type: Node}) visuals: Node
    @property({type: CircleCollider2D}) collider: CircleCollider2D = null
    private dir: Vec2
    bonusSpeed: number
    private startScale: Vec3

    Initialize(){
        this.startScale = this.visuals.scale
    }
    start(){
        this.chooseDirection()
    }
    chooseDirection(){
        let x = randomRange(-1,1)
        let y = randomRange(-1,1)
        this.dir = new Vec2(x,y)
        this.rigidbody.applyLinearImpulseToCenter(this.dir.multiplyScalar(this.speed), true)
        this.checkFlip(-this.dir.x)
    }

    timer: number = 0
    time: number = 5
    update(dt){
        this.timer+= dt
        if(this.timer >= this.time){
            this.timer = 0
            this.chooseDirection()
        }
    }

    closestPoint(){
        let controller: FireflyController = find("Canvas/Container/FireflyController").getComponent(FireflyController)
        let target = controller.getClosestPoint(this.node.worldPosition)
        let pos = target.worldPosition
        if(Vec3.distance(this.node.worldPosition, pos) < 100){
            controller.pushRoamigPOint(target)
            this.activate()
            return
        }
        let time = Vec3.distance(this.node.worldPosition, pos) / this.moveInSpeed
        this.checkFlip(pos.x - this.node.worldPosition.x)
        tween(this.node)
        .to(time, {worldPosition: pos})
        .call(() => {
            controller.pushRoamigPOint(target)
            this.activate()
        }).start()
        //this.activate()
    }

    private checkFlip(dir: number){
        let sc: Vec3
        if(dir < 0)
            sc = new Vec3(this.startScale.x * -1, this.startScale.y)
        else
            sc = this.startScale
        this.visuals.scale = sc
        // tween(this.visuals).to(0.2, {scale: sc}).start()
    }
    
    activate(){
        this.collider.group = 1
        this.chooseDirection()
    }

    disable(){
        this.dir = Vec2.ZERO
        this.collider.group = 0
        this.rigidbody.linearVelocity = Vec2.ZERO
        this.rigidbody.enabled = false
    }
}


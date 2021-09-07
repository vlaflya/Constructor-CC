
import { _decorator, Component, Event, Node, Color, tween, Vec2, Vec3, Sprite, color, easing, SkeletalAnimation, Skeleton, sp } from 'cc';
import { FireflyController } from './FireflyController';
import { FireflyFreeRoamState } from './FireflyFreeRoamState';
import { FireflyDragState } from './FireflyDragState';
import { FireflyMoveState } from './FireflyMoveState';
import { FireflyAnimation } from './FireflyAnimation';
const { ccclass, property } = _decorator;

@ccclass('Firefly')
export class Firefly extends Component {

    @property({type:FireflyFreeRoamState}) freeRoam: FireflyFreeRoamState = null!
    @property({type:FireflyFreeRoamState}) drag: FireflyDragState = null!
    @property({type: FireflyMoveState}) move: FireflyMoveState = null!
    @property({type: FireflyAnimation}) animation: FireflyAnimation = null!

    @property({type: Color}) color: Color = new Color()
    private isLocked: boolean = false
    private startScale: Vec3

    public Initialize(isLocked: boolean, speed?: number, size?: number){
        this.isLocked = isLocked
    }
    onLoad(){
        this.node.on(Node.EventType.TOUCH_END, this.onEndTouch, this)
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onEndTouch, this)
        this.node.on(Node.EventType.TOUCH_START, this.onStartTouch, this)
        this.SetColor(this.color)
    }
    start(){
        this.Initialize(false)
        this.move.Initialize(this)
        if(!this.isLocked){
            this.freeRoam.enabled = true
            this.freeRoam.Initialize()
        }
    }
    public SetColor(color: Color){
        this.color = color
        this.animation.SetColor(color)
    }
    public GetColor(): Color{
        return this.color
    }
    public StartRoam(){
        if(this.isLocked)
            return
        this.freeRoam.enabled = true
        this.freeRoam.Initialize()
        this.animation.SetSelect(false)
    }
    public StopRoam(){
        this.freeRoam.enabled = false
        this.animation.SetSelect(true)
    }
    public Lock(){
        this.node.off(Node.EventType.TOUCH_END, this.onEndTouch, this)
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onEndTouch, this)
        this.node.off(Node.EventType.TOUCH_START, this.onStartTouch, this)
        this.StopRoam()
        this.isLocked = true
    }
    
    onStartTouch(){
        //this.drag.EnableDrag
    }
    onEndTouch(){
        this.drag.DisableDrag
        this.startScale = this.node.getScale()
        tween(this.node).to(0.2 ,{scale: this.startScale.multiplyScalar(2)},{easing: "bounceIn"}).
                        to(0.2,{scale: this.startScale.multiplyScalar(0.5)},{easing: "bounceIn"}).start()
        this.StopRoam()
        this.move.enabled = true
        FireflyController.Instance.SetFireFly(this.move)
    }
}


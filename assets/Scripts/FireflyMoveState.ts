
import { _decorator, Component, Node, CCFloat, systemEvent, SystemEvent, Event, EventTouch, Touch, Vec2, Vec3, UITransform, macro, Color, tween, find, sys, Tween, animation } from 'cc';
import { Firefly } from './Firefly';
import { FireflyController } from './FireflyController';
import { FireflyAnimation } from './FireflyAnimation';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('FireflyMoveState')
export class FireflyMoveState extends Component {
    @property({type: CCFloat}) moveSpeed: number
    firefly: Firefly
    fireflyController: FireflyController
    anim: FireflyAnimation

    onLoad(){
        this.fireflyController = find("Canvas/Container/FireflyController").getComponent(FireflyController)
        //systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this)
    }
    public Initialize(firefly: Firefly, anim: FireflyAnimation){
        this.firefly = firefly
        this.anim = anim
    }

    onTouchStart(touch: Touch, event: EventTouch){
        if(this.firefly.stateMachine.isCurrentState("controledMove")){
            let touchPos: Vec3 = new Vec3(touch.getUILocation().x, touch.getUILocation().y)
            this.TweenMove(touchPos)
        }
    }
    keepSound: boolean = false
    onTouchMove(touch: Touch, event: EventTouch){
        if(this.firefly.stateMachine.isCurrentState("controledMove")){
            if(!this.keepSound){
                this.keepSound = true
                console.log("addedKeep")
                SoundManager.Instance.setSound(this.node, "Keep", true, true)
            }
            let touchPos: Vec3 = new Vec3(touch.getUILocation().x, touch.getUILocation().y)
            this.LerpMove(touchPos)
        }
    }
    onTouchEnd(touch: Touch, event: EventTouch){
        if(this.firefly.stateMachine.isCurrentState("controledMove")){
            SoundManager.Instance.removeSound(this.node)
            this.keepSound = false
            this.??hecksCallback()
        }
    }

    private TweenMove(pos: Vec3){
        Tween.stopAllByTarget(this.node)
        let time: number = Vec3.distance(this.node.worldPosition, pos)/this.moveSpeed
        tween(this.node).to(time, {worldPosition: pos}).call(() => {this.??hecksCallback()}).start()
    }

    private LerpMove(pos: Vec3){
        Tween.stopAllByTarget(this.node)
        this.node.setWorldPosition(this.node.worldPosition.lerp(pos, 0.5))
        //this.??hecksCallback()
    }
    
    ??hecksCallback(){
        let st: string = this.fireflyController.checkConnection()
        if(st == "wrongColor"){
            SoundManager.Instance.setSound(this.node, "Negative", false, false)
            this.anim.Wrong()
        }
        if(st == "far")
            this.fireflyController.checkColorChange()
        this.firefly.checksEnded(st)
    }
}

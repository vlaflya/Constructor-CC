
import { _decorator, Component, Event, Node, Color, tween, Vec2, Vec3, Sprite, color, easing, SkeletalAnimation, Skeleton, sp, find } from 'cc';
import { FireflyController } from './FireflyController';
import { FireflyFreeRoamState } from './FireflyFreeRoamState';
import { FireflyDragState } from './FireflyDragState';
import { FireflyMoveState } from './FireflyMoveState';
import { FireflyAnimation } from './FireflyAnimation';
import { WinChecker } from './WinChecker';
const { ccclass, property } = _decorator;

@ccclass('Firefly')
export class Firefly extends Component {

    @property({type:FireflyFreeRoamState}) freeRoam: FireflyFreeRoamState = null!
    @property({type: FireflyMoveState}) move: FireflyMoveState = null!
    @property({type: FireflyAnimation}) animation: FireflyAnimation = null!
    
    @property({type: Color}) color: Color = new Color()

    fireflyController: FireflyController
    private isLocked: boolean = false
    private startScale: Vec3

    public Initialize(isLocked: boolean, roamPoints: Array<Node>, speed?: number, size?: number){
        this.isLocked = isLocked
        this.freeRoam.Initialize(roamPoints)
    }
    onLoad(){
        this.fireflyController = find("Canvas/FireflyController").getComponent(FireflyController)
        this.node.on(Node.EventType.TOUCH_END, this.onEndTouch, this)
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onEndTouch, this)
        this.node.on(Node.EventType.TOUCH_START, this.onStartTouch, this)
        this.SetColor(this.color)
    }
    start(){
        this.move.Initialize(this)
        if(!this.isLocked){
            this.freeRoam.enabled = true
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
        this.animation.Lock()
        WinChecker.Instance.CheckWin()
    }
    
    onStartTouch(){
        //this.drag.EnableDrag
    }
    onEndTouch(){
        this.startScale = this.node.getScale()
        tween(this.node).to(0.2 ,{scale: this.startScale.multiplyScalar(2)},{easing: "bounceIn"}).
                        to(0.2,{scale: this.startScale.multiplyScalar(0.5)},{easing: "bounceIn"}).start()
        this.StopRoam()
        this.move.enabled = true
        this.fireflyController.SetFireFly(this.move)
    }
}


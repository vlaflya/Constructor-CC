
import { _decorator, Component, Event, Node, Color, tween, Vec2, Vec3, Sprite, color, easing, SkeletalAnimation, Skeleton, sp, find, randomRange, randomRangeInt } from 'cc';
import { FireflyController } from './FireflyController';
import { FireflyFreeRoamState } from './FireflyFreeRoamState';
import { FireflyMoveState } from './FireflyMoveState';
import { FireflyAnimation } from './FireflyAnimation';
import { WinChecker } from './WinChecker';
import GeneralStateMachine from './GeneralStateMachine';
import { ColorChanger } from './ColorChanger';
import { Slot } from './Slot';
const { ccclass, property } = _decorator;

@ccclass('Firefly')
export class Firefly extends Component {

    @property({type:FireflyFreeRoamState}) freeRoam: FireflyFreeRoamState = null!
    @property({type: FireflyMoveState}) move: FireflyMoveState = null!
    @property({type: FireflyAnimation}) animation: FireflyAnimation = null!
    @property({type: Color}) color: Color = new Color()
    stateMachine: GeneralStateMachine
    fireflyController: FireflyController
    private isLocked: boolean = false
    private startScale: Vec3
    private inside: boolean

    public Initialize(isLocked: boolean, roamPoints: Array<Node>,color: Color, inside: boolean, size?: number){
        this.isLocked = isLocked
        this.color = color
        this.freeRoam.Initialize(roamPoints)
        this.inside = inside
    }
    onLoad(){
        this.stateMachine = new GeneralStateMachine(this, this.node.name)
        this.stateMachine
        .addState("init", {onEnter: this.onInitializeEnter, onExit: this.onInitializeExit})
        .addState("firstColor", {onEnter: this.onFirstColorEnter, onExit: this.onFirstColorExit})
        .addState("outside", {onEnter: this.onMoveOutsideEnter, onExit: this.onMoveOutsideExit})
        .addState("roam", {onEnter: this.onRoamEnter, onExit: this.onRoamExit})
        .addState("controledMove", {onEnter: this.onControlMoveEnter, onExit: this.onControlMoveExit})
        .addState("colorChange", {onEnter: this.onSetColorEnter, onExit: this.onSetColorExit})
        .addState("lock", {onEnter: this.onSetLockedEnter})
    }

    start(){
        this.stateMachine.setState("init")
    }

    //init
    onInitializeEnter(){
        this.fireflyController = find("Canvas/Container/FireflyController").getComponent(FireflyController)
        this.fireflyController.node.on("spawnEnded", () => {this.endInitialization()})
        this.move.Initialize(this)
        this.node.scale = new Vec3(0,0,0)
        tween(this.node).to(2, {scale: new Vec3(1,1,1)}).start()
    }
    endInitialization(){
        this.stateMachine.exitState()
        console.log("oke");
    }
    onInitializeExit(){
        this.stateMachine.setState("firstColor");
    }
    //firstColor
    onFirstColorEnter(){
        tween(this.node).by(0.5, {position: this.node.position.multiplyScalar(1.05)})
        .call(() => {this.onFirstColorTweenCallback()}).start()
    }
    onFirstColorTweenCallback(){
        this.animation.SetColor(this.color)
        this.stateMachine.exitState()
    }
    onFirstColorExit(){
        if(!this.isLocked){
            if(this.inside){
                this.stateMachine.setState("roam")
                return
            }
            this.stateMachine.setState("outside")
        }
    }
    //outside
    onMoveOutsideEnter(){
        let dir: number = randomRangeInt(-1, 2)
        if(dir == 0)
            dir = 1
        let pos: Vec3 = new Vec3(1500 * dir,randomRange(-500, 500), 0)
        tween(this.node).to(2, {worldPosition: pos}).start()
    }
    moveInside(){
        this.stateMachine.exitState()
    }
    onMoveOutsideExit(){
        this.stateMachine.setState("roam")
    }

    //roam
    onRoamEnter(){
        this.node.on(Node.EventType.TOUCH_START, this.onTouch, this)
        this.freeRoam.enabled = true
        this.freeRoam.ClosestPoint()
    }
    onTouch(){
        this.stateMachine.exitState()
    }
    onRoamExit(){
        this.freeRoam.enabled = false
        this.node.off(Node.EventType.TOUCH_START, this.onTouch, this)
        this.stateMachine.setState("controledMove")
    }

    //controledMove
    onControlMoveEnter(){
        this.animation.SetSelect(true)
        this.startScale = this.node.getScale()
        tween(this.node).to(0.2 ,{scale: this.startScale.multiplyScalar(2)},{easing: "bounceIn"}).
                        to(0.2,{scale: this.startScale.multiplyScalar(0.5)},{easing: "bounceIn"}).start()
        this.fireflyController.SetFireFly(this)
    }

    endMove(st: string){
        this.stateMachine.exitState(st)
    }

    onControlMoveExit(condition?: string){
        this.animation.SetSelect(false)
        if(condition == null){
            console.warn("null condition on exitMove for firefly");
            return
        }
        if(condition == "change"){
            this.stateMachine.setState("roam")
            this.freeRoam.MoveIn()
            return
        }
        if(condition == "color"){
            this.stateMachine.setState("colorChange")
            return
        }
        if(condition == "lock"){
            this.stateMachine.setState("lock")
            return
        }
    }

    //colorChange
    onSetColorEnter(){
        let colorChanger: ColorChanger = find("Canvas/Container/ColorChanger").getComponent(ColorChanger)
        this.color  = colorChanger.GetNextColor(this.color)
        tween(this.node).to(0.5, {worldPosition: colorChanger.node.worldPosition}).call(() => this.colorCallback())
        .by(0.5, {worldPosition: new Vec3(100,0,0)})
        .start()
    }
    public colorCallback(){
        this.animation.SetColor(this.color)
        this.stateMachine.exitState()
    }    
    onSetColorExit(){
        this.stateMachine.setState("roam")
    }
    //lock
    slot: Slot
    setSlotPos(s: Slot){
        this.slot = s
    }
    onSetLockedEnter(){
        this.slot.TryLock()
        let startScale: Vec3 = new Vec3(this.node.scale)
        tween(this.node).to(0.1, {worldPosition: this.slot.GetPosition()}).to(0.5, {scale: startScale.multiplyScalar(0.5)}).call(() => {this.Lock()}).start()
    }
    public Lock(){
        this.isLocked = true
        this.animation.Lock()
        this.node.setParent(this.slot.GetParent())
        this.node.setPosition(Vec3.ZERO)
        WinChecker.Instance.CheckWin()
    }
    public GetColor(): Color{
        return this.color
    }
}


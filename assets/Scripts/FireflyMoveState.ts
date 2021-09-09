
import { _decorator, Component, Node, CCFloat, systemEvent, SystemEvent, Event, EventTouch, Touch, Vec2, Vec3, UITransform, macro, Color, tween, find } from 'cc';
import { Firefly } from './Firefly';
import { FireflyController } from './FireflyController';
const { ccclass, property } = _decorator;

@ccclass('FireflyMoveState')
export class FireflyMoveState extends Component {
    @property({type: CCFloat}) moveTime: number
    firefly: Firefly
    canMove: boolean = true
    fireflyController: FireflyController
    onLoad(){
        this.fireflyController = find("Canvas/FireflyController").getComponent(FireflyController)
    }
    public Initialize(firefly: Firefly){
        this.firefly = firefly
    }

    public startMove(){
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouch, this)
    }
    public stopMove(){
        systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onTouch, this)
    }

    onTouch(touch: Touch, event: EventTouch){
        let touchPos: Vec3 = new Vec3(touch.getUILocation().x, touch.getUILocation().y)
        this.Move(touchPos)
    }

    public Move(pos: Vec3){
        if(this.canMove){
            this.canMove = false
            console.log(this.canMove);
            tween(this.node).to(this.moveTime, {worldPosition: pos}).start()
            this.Checks()
        }
    }

    async Checks(){
        await new Promise(f => setTimeout(f, this.moveTime * 1000));
        this.canMove =  !this.fireflyController.CheckConnection(this.firefly)
        this.canMove =  !this.fireflyController.CheckColorChange(this.firefly)
    }
    public Lock(pos: Vec3){
        tween(this.node).to(0.5 ,{worldPosition : pos}).start()
        this.firefly.Lock()
        this.enabled = false
        //this.LockDelay()
    }
    async LockDelay(){
        await new Promise(f => setTimeout(f, this.moveTime * 1000));
        // this.firefly.Lock()
    }
    public ChangeColor(color: Color, pos: Vec3){
        tween(this.node).to(0.5 ,{worldPosition : pos}).start()
        this.ColorDelay(color)
    }
    async ColorDelay(color: Color){
        await new Promise(f => setTimeout(f, 500));
        this.firefly.SetColor(color)
        this.canMove = true
    }
}

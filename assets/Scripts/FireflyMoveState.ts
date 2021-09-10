
import { _decorator, Component, Node, CCFloat, systemEvent, SystemEvent, Event, EventTouch, Touch, Vec2, Vec3, UITransform, macro, Color, tween, find } from 'cc';
import { Firefly } from './Firefly';
import { FireflyController } from './FireflyController';
const { ccclass, property } = _decorator;

@ccclass('FireflyMoveState')
export class FireflyMoveState extends Component {
    @property({type: CCFloat}) moveSpeed: number
    firefly: Firefly
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
        console.log(touchPos.toString());
        this.Move(touchPos)
    }

    public Move(pos: Vec3){
        let time: number = Vec3.distance(this.node.worldPosition, pos)/this.moveSpeed
        tween(this.node).to(time, {worldPosition: pos}).call(() => {this.сhecksCallback()}).start()
    }

    сhecksCallback(){
        if(!this.fireflyController.CheckConnection())
            this.fireflyController.CheckColorChange()
    }
}

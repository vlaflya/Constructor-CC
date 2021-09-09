
import { _decorator, Component, Node, CCFloat, systemEvent, SystemEvent, Event, EventTouch, Touch, Vec2, Vec3, UITransform, macro, Color, tween, find } from 'cc';
import { Firefly } from './Firefly';
import { FireflyController } from './FireflyController';
const { ccclass, property } = _decorator;

@ccclass('FireflyMoveState')
export class FireflyMoveState extends Component {
    @property({type: CCFloat}) moveTime: number
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
        tween(this.node).to(this.moveTime, {worldPosition: pos}).start()
        this.Checks()
    }

    async Checks(){
        await new Promise(f => setTimeout(f, this.moveTime * 1000));
        if(!this.fireflyController.CheckConnection())
            this.fireflyController.CheckColorChange()
    }
}

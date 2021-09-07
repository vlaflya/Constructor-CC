
import { _decorator, Component, Node, systemEvent, SystemEvent, EventTouch, Touch, tween, CCFloat, Vec2, Vec3, macro } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FireflyDragState')
export class FireflyDragState extends Component {
    @property({type: CCFloat}) moveTime: number
    private drag: boolean = true
    private touchPos: Vec3 = new Vec3(100,100)
    onStart(){
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouch, this)
        macro.ENABLE_MULTI_TOUCH = false
        tween(this.node).to(this.moveTime ,{worldPosition : this.touchPos}).start()
    }
    public EnableDrag(){
        this.drag = true
    }
    public DisableDrag(){
        this.drag = false
    }
    update(dt){
        // if(!this.drag){
        //     return
        // }
        // console.log("oke");
        // this.node.setWorldPosition(this.node.worldPosition.lerp(this.touchPos,dt * 2))
        // tween(this.node).to(this.moveTime ,{worldPosition : this.touchPos}).start()
    }
    onTouch(touch: Touch, event: EventTouch){
        console.log("oke");
        this.touchPos = new Vec3(touch.getUILocation().x, touch.getUILocation().y)
        tween(this.node).to(this.moveTime ,{worldPosition : this.touchPos}).start()
    }

}


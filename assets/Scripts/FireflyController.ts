
import { _decorator, Component, Node, CCFloat, systemEvent, SystemEvent, Event, EventTouch, Touch, Vec2, Vec3, UITransform, macro, Color } from 'cc';
import { Firefly } from './Firefly';
import { Slot } from './Slot';
import { ColorChanger } from './ColorChanger';
import { FireflyMoveState } from './FireflyMoveState';
const { ccclass, property } = _decorator;

@ccclass('FireflyController')
export class FireflyController extends Component {
    @property({type: CCFloat}) moveTime: number
    @property({type: Node}) fireflies: Array<Node>
    @property({type: CCFloat}) minDistance: number
    @property({type: ColorChanger}) colorChanger: ColorChanger
    @property({type: CCFloat}) connectDistance: number
    private slots: Array<Slot> = []
    private touchPos: Vec3
    static Instance: FireflyController
    private firefly: FireflyMoveState

    onLoad(){
        console.log("controller");
        
        if(FireflyController.Instance == null)
            FireflyController.Instance = this
        else
            this.node.destroy()
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouch, this)
        macro.ENABLE_MULTI_TOUCH = false;
    }
    public SetSlots(slots: Array<Slot>){
        this.slots = slots
    }
    onTouch(touch: Touch, event: EventTouch){
        this.touchPos = new Vec3(touch.getUILocation().x, touch.getUILocation().y)
        if(this.firefly != null && this.firefly.enabled){
            this.firefly.Move(this.touchPos)
        }
    }

    public CheckConnection(checkFirefly: Firefly): boolean{
        let closestSlot: Slot = null
        let found: boolean = false
        this.slots.forEach(slot => {
        if(found)
            return
        if(Vec3.distance(checkFirefly.node.position, slot.node.position) > this.connectDistance){
            return
        }
        if(!slot.GetColor().equals(checkFirefly.GetColor())){
            return
        }
        closestSlot = slot
        found = true
        });
        if(found == false)
            return false
        checkFirefly.move.Lock(closestSlot.node.worldPosition)
        //this.firefly = null
        return true
    }

    public CheckColorChange(checkFirefly: Firefly): boolean{
        if(Vec3.distance(checkFirefly.node.position, this.colorChanger.node.position) > this.connectDistance){
            console.log("DistanceCheck");
            return false
        }
        checkFirefly.move.ChangeColor(this.colorChanger.GetRandomColor(checkFirefly.GetColor()), this.colorChanger.node.worldPosition)
        return true
    }
    SetFireFly(fireFly: FireflyMoveState){
        if(this.firefly != null)
            this.firefly.StopMove()
        this.firefly = fireFly
    }
}

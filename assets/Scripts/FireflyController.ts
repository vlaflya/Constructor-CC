
import { _decorator, Component, Node, CCFloat, systemEvent, SystemEvent, Event, EventTouch, Touch, Vec2, Vec3, UITransform, macro, Color, color } from 'cc';
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
    private currentFirefly: Firefly

    onLoad(){
    }
    public SetSlots(slots: Array<Slot>){
        this.slots = slots
    }

    public CheckConnection(): string{
        let closestSlot: Slot = null
        this.slots.forEach(slot => {
            let dis: number = Vec3.distance(this.currentFirefly.node.position, slot.node.position)
            if(dis < this.connectDistance){
                if(closestSlot == null){
                    closestSlot = slot
                    return
                }
                if(dis < Vec3.distance(this.currentFirefly.node.position, slot.node.position)){
                    closestSlot = slot
                    return
                }
            }
        });
        
        if(closestSlot == null)
            return "far"
        if(!closestSlot.GetColor().equals(this.currentFirefly.GetColor()))
            return "color"
        if(closestSlot.isLit)
            return "taken"

        this.currentFirefly.setSlotPos(closestSlot)
        this.currentFirefly.endMove("lock")
        this.currentFirefly = null
        if(this.outsideArray.length > 0){
            this.outsideArray.pop().moveInside()
        }
        return "oke"
    }

    public CheckColorChange(): boolean{
        if(Vec3.distance(this.currentFirefly.node.position, this.colorChanger.node.position) > this.connectDistance){
            return false
        }
        this.currentFirefly.endMove("color")
        this.currentFirefly = null
        return true
    }
    SetFireFly(fireFly: Firefly){
        if(fireFly == this.currentFirefly)
            return
        if(this.currentFirefly != null){
            this.currentFirefly.endMove("change")
        }
        this.currentFirefly = fireFly
    }
    outsideArray: Array<Firefly> = []
    
    addOutsideArray(outside:Firefly){
        this.outsideArray.push(outside)
    }
    public async SpawnEnded(){
        delay(1000).then(() => {this.node.emit("spawnEnded")})
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

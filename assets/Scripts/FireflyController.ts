
import { _decorator, Component, Node, CCFloat, systemEvent, SystemEvent, Event, EventTouch, Touch, Vec2, Vec3, UITransform, macro, Color, color } from 'cc';
import { Firefly } from './Firefly';
import { Slot } from './Slot';
import { ColorChanger } from './ColorChanger';
import { FireflyMoveState } from './FireflyMoveState';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('FireflyController')
export class FireflyController extends Component {
    @property({type: CCFloat}) moveTime: number
    fireflies: Array<Firefly> = []
    @property({type: CCFloat}) minDistance: number
    @property({type: ColorChanger}) colorChanger: ColorChanger
    @property({type: CCFloat}) connectDistance: number
    @property({type: [Node]}) roamingPoints: Array<Node> = []
    private slots: Array<Slot> = []
    private currentFirefly: Firefly


    public init(slots: Array<Slot>, roamingPoints: Array<Node>){
        this.slots = slots
        this.roamingPoints = roamingPoints
    }
    public getClosestPoint(pos: Vec3): Node{
        console.log(this.roamingPoints.length)
        let minPos: Vec3 = new Vec3(5000,5000,5000)
        let target: Node = null 
        this.roamingPoints.forEach(tar => {
            if(Vec3.distance(pos, tar.worldPosition) < Vec3.distance(pos, minPos)){
                minPos = tar.worldPosition
                target = tar
            }
        });
        let i: number = this.roamingPoints.indexOf(target)
        this.roamingPoints.splice(i, 1)
        return target
    }
    public pushRoamigPOint(point: Node){
        this.roamingPoints.push(point)
    }

    public checkConnection(): string{
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
        if(!closestSlot.CheckColor(this.currentFirefly.GetColor()))
            return "color"
        if(closestSlot.isLit)
            return "taken"

        this.currentFirefly.setSlotPos(closestSlot)
        this.currentFirefly.endMove("lock")
        this.currentFirefly = null
        if(this.outsideArray.length > 0){
            console.log("moveInside")
            this.outsideArray.pop().moveInside()
        }
        return "oke"
    }

    public checkColorChange(): boolean{
        if(this.currentFirefly.node != null && this.colorChanger.node != null){
            if(Vec3.distance(this.currentFirefly.node.position, this.colorChanger.node.position) > (this.connectDistance * 1.5)){
                return false
            }
            this.currentFirefly.endMove("color")
            this.currentFirefly = null
            return true
        }
        return false
    }
    setFireFly(fireFly: Firefly){
        if(fireFly == this.currentFirefly)
            return
        let pos: Vec3
        if(this.currentFirefly != null){
            this.currentFirefly.endMove("change")
            pos = this.currentFirefly.node.position
            this.currentFirefly.node.position = new Vec3(pos.x, pos.y, 0)
        }
        this.currentFirefly = fireFly
        pos = this.currentFirefly.node.position
        this.currentFirefly.node.position = new Vec3(pos.x, pos.y, 1)
        this.node.children.sort((a,b) => a.position.z - b.position.z)
    }
    outsideArray: Array<Firefly> = []
    
    addOutsideArray(outside:Firefly){
        this.outsideArray.push(outside)
    }
    public async spawnEnded(flies: Array<Firefly>){
        this.fireflies = flies
        SoundManager.Instance.setSound(this.node, "AfterFX", false, true)
        delay(1000).then(() => {this.node.emit("spawnEnded")})
    }
    public sing(){
        this.fireflies.forEach(fly => {
            fly.sing()
        });
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

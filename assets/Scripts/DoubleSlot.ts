
import { _decorator, Component, Node, Color, Vec3, Prefab, instantiate, Sprite, color } from 'cc';
import { Slot } from './Slot';
const { ccclass, property } = _decorator;

@ccclass('DoubleSlot')
export class DoubleSlot extends Slot {
    @property({type: Prefab}) slotPrefab: Prefab
    slot1: Node
    slot2: Node
    slotDistance: number = 20
    takenColor: Color = new Color(0,0,0,0)

    public Initialize (index,color: Color, isLit: boolean, x: number , y: number){
        this.index= index
        this.color = color
        this.isLit = isLit
        this.position = new Vec3(x, -y, 0)
        this.node.position = this.position
        this.slot1 = this.CreateSlot(1, color)
        this.slot2 = this.CreateSlot(-1, color)
    }

    private CreateSlot(m: number, color: Color): Node{
        let sl = instantiate(this.slotPrefab)
        sl.parent = this.node
        sl.position = new Vec3(m * this.slotDistance,0,0)
        sl.getChildByPath("Visuals/MainColor").getComponent(Sprite).color = color
        return sl
    }

    lefTaken: boolean = false
    rigthTaken: boolean = false
    public TryLock(){
        if(this.lefTaken && this.rigthTaken && !this.isLit){
            this.isLit = true
            this.ColorLines()
            this.slot1.getChildByName("Visuals").active = false
            this.slot2.getChildByName("Visuals").active = false
        }
    }
    public GetPosition(pos?: Vec3) : Vec3{
        if(Vec3.distance(pos, this.slot1.worldPosition) < Vec3.distance(pos, this.slot2.worldPosition) && !this.lefTaken){
            return this.slot1.worldPosition
        }
        if(this.rigthTaken)
            return this.slot1.worldPosition
        return this.slot2.worldPosition
    }
    public GetParent(pos?: Vec3): Node{
        if(Vec3.distance(pos, this.slot1.worldPosition) < Vec3.distance(pos, this.slot2.worldPosition) && !this.lefTaken){
            this.lefTaken = true
            return this.slot1
        }
        if(this.rigthTaken){
            this.lefTaken = true
            return this.slot1
        }
        this.rigthTaken = true
        return this.slot2
    }

    CheckColor(color: Color): boolean{
        if(color.equals(this.takenColor))
            return
        console.log(color.toString() + " " + this.takenColor.toString());
        if(this.color.equals(new Color(255,165,0, 255))){
            if(color.equals(new Color(new Color(255,255,0,255))) || color.equals(new Color(new Color(255,0,0,255)))){
                this.takenColor = color
                return true
            }
            else return false
        }
        if(this.color.equals(new Color(255,0,255, 255))){
            if(color.equals(new Color(new Color(0,125,255,255))) || color.equals(new Color(new Color(255,0,0,255)))){
                this.takenColor = color
                return true
            }
            else return false
        }
        if(this.color.equals(new Color(0,255,0,255))){
            if(color.equals(new Color(new Color(0,125,255,255))) || color.equals(new Color(new Color(255,255,0,255)))){
                this.takenColor = color
                return true
            }
            else return false
        }

        return false
    }

}


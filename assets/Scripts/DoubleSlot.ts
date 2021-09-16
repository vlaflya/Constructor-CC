
import { _decorator, Component, Node, Color, Vec3, Prefab, instantiate, Sprite } from 'cc';
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

        this.slot1 = instantiate(this.slotPrefab)
        this.slot1.parent = this.node
        this.slot1.position = new Vec3(this.slotDistance,0,0)
        this.slot1.getComponent(Sprite).color = color

        this.slot2 = instantiate(this.slotPrefab)
        this.slot2.parent = this.node
        this.slot2.position = new Vec3(-this.slotDistance,0,0)
        this.slot2.getComponent(Sprite).color = color
    }

    slotsLeft: number = 2
    public TryLock(){
        this.slotsLeft--
        if(this.slotsLeft == 0){
            this.isLit = true
            this.ColorLines()
        }
    }
    public GetPosition(pos?: Vec3) : Vec3{
        if(this.slotsLeft == 1)
            return this.slot1.worldPosition
        return this.slot2.worldPosition
    }
    public GetParent(): Node{
        if(this.slotsLeft == 1)
            return this.slot1
        return this.slot2
    }

    CheckColor(color: Color): boolean{
        if(color.equals(this.takenColor))
            return
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


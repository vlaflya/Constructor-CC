
import { _decorator, Component, Node, Color, Vec3, Graphics, Sprite, color, tween, easing } from 'cc';
import { Line } from './Line';
const { ccclass, property } = _decorator;

@ccclass('Slot')
export class Slot extends Component {
    @property({type: Sprite}) sprite: Sprite
    @property({type: Node}) visuals: Node
    index: string
    color: Color
    isLit:boolean
    position: Vec3
    lines: Array<Line> = []
    
    public Initialize (index, color: Color, isLit: boolean, x: number , y: number){
        this.index= index
        this.color = color
        this.isLit = isLit
        this.position = new Vec3(x, -y, 0)
        this.node.position = this.position
        this.sprite = this.node.getChildByPath("SlotVisualsPrefab/Visuals/MainColor").getComponent(Sprite)
        this.sprite.color = color
        if(isLit){
            this.visuals.active = false
        }
    }
    
    public GetPosition(pos?: Vec3) : Vec3{
        return this.node.worldPosition
    }
    public GetParent(pos?: Vec3): Node{
        return this.node
    }
    public GetID(): string{
        return this.index
    }
    public CheckColor(color: Color): boolean{
        if(this.color.equals(new Color(200,200,200,255))){
            this.color = color
            return true
        }
        return (color.equals(this.color))
    }
    public TryLock(){
        if(!this.isLit){
            this.isLit = true
            this.ColorLines()
            this.visuals.active = false
        }
    }
    public ColorLines(){
        this.lines.forEach(line => {
            line.colorLine(this.color)
        });
    }
    public blinkLines(){
        this.lines.forEach(line => {
            //line.blinkLines()
        });
    }
    public AddLine(line: Line){
        this.lines.push(line)
    }
}

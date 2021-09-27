
import { _decorator, Component, Node, Color, Vec3, Graphics, Sprite, color } from 'cc';
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
        this.sprite.color = color
        if(isLit){
            this.visuals.active = false
        }
    }
    public GetPosition(pos?: Vec3) : Vec3{
        return this.node.worldPosition
    }
    public GetParent(): Node{
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
        this.isLit = true
        this.ColorLines()
    }
    public ColorLines(){
        console.log("wtf2");
        this.lines.forEach(line => {
            line.ColorLine(this.color)
        });
    }
    public AddLine(line: Line){
        this.lines.push(line)
    }
}

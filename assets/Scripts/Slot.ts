
import { _decorator, Component, Node, Color, Vec3, Graphics, Sprite } from 'cc';
import { Line } from './Line';
const { ccclass, property } = _decorator;

@ccclass('Slot')
export class Slot extends Component {
    @property({type: Sprite}) sprite: Sprite
    index: string
    type: number
    color: Color
    isLit:boolean
    position: Vec3
    lines: Array<Line> = []
    
    public Initialize (index, type:number = 0, color: Color, isLit: boolean, x: number , y: number){
        this.index= index
        this.type = type
        this.color = color
        this.isLit = isLit
        this.position = new Vec3(x, -y, 0)
        this.node.position = this.position
        this.sprite.color = color
    }
    public GetID(): string{
        return this.index
    }
    public GetColor(): Color{
        return this.color
    }
    public AddLine(line: Line){
        if(this.lines.length = 0){
            this.lines[0] = line
            return
        }
        this.lines[this.lines.length] = line
    }
}

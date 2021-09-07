
import { _decorator, Component, Node, Vec3, Graphics, Prefab, instantiate, Color, color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Line')
export class Line extends Component {
    @property({type: Graphics}) graph: Graphics
    @property({type: Prefab}) corner: Prefab
    point1: Vec3
    point2: Vec3
    slotColor: Color
    lineWidth: number

    public Initialize (x1: number, x2: number, y1: number, y2: number, slotColor: Color ,lineWidth: number){
        this.point1 = new Vec3(x1, -y1)
        this.point2 = new Vec3(x2, -y2)
        this.slotColor = new Color(slotColor)
        this.slotColor.a = 153
        this.lineWidth = lineWidth
        this.DrawLine()
    }

    private DrawLine(){
        this.graph.lineWidth = this.lineWidth
        this.graph.moveTo(this.point1.x, this.point1.y)
        this.graph.lineTo(this.point2.x, this.point2.y)
        this.graph.strokeColor = this.slotColor
        this.graph.stroke()
        let corner :Node = instantiate(this.corner)
        corner.parent = this.node
        corner.position = this.point1
        corner = instantiate(this.corner)
        corner.parent = this.node
        corner.position = this.point2
    }
}


import { _decorator, Component, Node, Vec3, Graphics, Prefab, instantiate, Color, color, ParticleSystem2D, misc, Quat, Sprite, Vec2, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Line')
export class Line extends Component {
    @property({type: Prefab}) corner: Prefab
    @property({type: Prefab}) particlePrefab:Prefab
    @property({type: Prefab}) line: Prefab
    point1: Vec3
    point2: Vec3
    slotColor: Color
    lineWidth: number

    public Initialize (x1: number, x2: number, y1: number, y2: number, slotColor: Color ,lineWidth: number){
        this.point1 = new Vec3(x1, -y1)
        this.point2 = new Vec3(x2, -y2)
        this.slotColor = new Color(slotColor)
        this.slotColor.a = 150
        this.lineWidth = lineWidth
        this.DrawCorners()
        this.DrawLine()
    }

    private DrawCorners(){
        let corner :Node = instantiate(this.corner)
        corner.parent = this.node
        corner.position = this.point1
        corner = instantiate(this.corner)
        corner.parent = this.node
        corner.position = this.point2
    }

    curLine: Node
    private DrawLine(){
        this.curLine = instantiate(this.line)
        this.curLine.getComponent(Sprite).color = this.slotColor
        this.curLine.parent = this.node
        // let middle: Vec3 = this.point1.lerp(this.point2, 0.5)
        this.curLine.position = this.point1

        
        let dist = Vec3.distance(this.point1, this.point2)
        this.curLine.setScale(0,0,1)
        tween(this.curLine).to(2, {scale: new Vec3(1.2,dist/50,1)}).start()
        //this.curLine.setScale(1.2,dist/50,1)

        let diff = this.point1.subtract(this.point2)
        let angle = Math.atan2(diff.y, diff.x)
        angle = misc.radiansToDegrees(angle) + 90
        this.curLine.angle = angle
    }
    public ColorLine(color: Color = null){

        if(color != null){
            console.log(color.toString());
            this.curLine.getComponent(Sprite).color = color
        }

        let line = instantiate(this.curLine)
        line.parent = this.node
        //line.setScale(0.3,0,0)
        tween(line).to(2, {scale: new Vec3(0.5, line.getScale().y, 1)}).start()
        //line.setScale(0.5, line.getScale().y)
        line.getComponent(Sprite).color = new Color(255,255,255, 80)
        this.slotColor.a = 200
    }
}

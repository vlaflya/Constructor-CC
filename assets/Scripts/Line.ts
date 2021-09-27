
import { _decorator, Component, Node, Vec3, Graphics, Prefab, instantiate, Color, color, ParticleSystem2D, misc, Quat, Sprite, Vec2, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Line')
export class Line extends Component {
    @property({type: Prefab}) corner: Prefab
    @property({type: Prefab}) particlePrefab:Prefab
    @property({type: Prefab}) line: Prefab
    @property({type: Prefab}) colorLine: Prefab
    point1: Vec3
    point2: Vec3
    slotColor: Color
    lineWidth: number

    public Initialize (x1: number, x2: number, y1: number, y2: number, slotColor: Color ,lineWidth: number){
        this.point1 = new Vec3(x1, -y1)
        this.point2 = new Vec3(x2, -y2)
        this.slotColor = new Color(slotColor)
        this.lineWidth = lineWidth
        this.DrawLine()
        //this.DrawCorners()
    }

    private DrawCorner(color: Color, pos: Vec3){
        let corner :Node = instantiate(this.corner)
        corner.parent = this.node
        corner.position = pos
        color.a = 100
        corner.getComponent(Sprite).color = color
        corner.scale = new Vec3(0,0,0)
        tween(corner).to(0.3, {scale: new Vec3(1,1,1)}).start()
    }

    curLine: Node
    curParticle: Node
    paritcleDensety: number
    private DrawLine(){
        this.curLine = instantiate(this.line)
        this.curLine.getComponent(Sprite).color = new Color(44,65,95,255)
        this.curLine.parent = this.node
        this.curLine.position = this.point1

        let dist = Vec3.distance(this.point1, this.point2)
        this.curLine.setScale(new Vec3(1.2,dist/50,1))
        let diff = this.point1.subtract(this.point2)
        let angle = Math.atan2(diff.y, diff.x)
        angle = misc.radiansToDegrees(angle) + 90
        this.curLine.angle = angle
        this.point1.add(this.point2)
    }

    public ColorLine(color: Color = null){
        if(color == null){
            console.log("null color");
            return
        }
        let coloredLine = instantiate(this.colorLine)
        coloredLine.parent = this.node
        coloredLine.position = this.curLine.position
        coloredLine.getComponent(Sprite).color = color
        coloredLine.scale = new Vec3(0,0,0)
        coloredLine.angle = this.curLine.angle
        //this.DrawCorner(color, this.point1)
        tween(coloredLine)
        .to(1.5, {scale: this.curLine.scale})
        //.call(() => {this.DrawCorner(color, this.point2)})
        .start()
        this.drawParticle()
        this.node.position.add(new Vec3(0,0,1))
        this.node.parent.children.sort((a,b) => a.position.z - b.position.z)
    }

    private drawParticle(){
        this.curParticle = instantiate(this.particlePrefab)
        Vec3.lerp(this.curParticle.position, this.point1, this.point2, 0.5)
        this.curParticle.parent = this.node
        this.curParticle.angle = this.curLine.angle
        let particles: ParticleSystem2D = this.curParticle.getChildByName("Particle").getComponent(ParticleSystem2D)
        this.paritcleDensety = particles.emissionRate / particles.posVar.y
        let dist = Vec3.distance(this.point1, this.point2)
        particles.posVar = new Vec2(particles.posVar.x, dist/2)
        particles.emissionRate = this.paritcleDensety * particles.posVar.y
    }
}

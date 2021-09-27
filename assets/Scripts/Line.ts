
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
        this.DrawCorners()
        this.DrawLine()
    }

    private DrawCorners(){
        let corner :Node = instantiate(this.corner)
        corner.parent = this.node
        corner.position = this.point1
        //corner.getComponent(Sprite).color = new Color(110,110,110,255)
        corner = instantiate(this.corner)
        corner.parent = this.node
        corner.position = this.point2
        //corner.getComponent(Sprite).color = new Color(110,110,110,255)
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

        this.curParticle = instantiate(this.particlePrefab)
        Vec3.lerp(this.curParticle.position, this.point1.add(this.point2), this.point2, 0.5)
        this.curParticle.parent = this.node
        this.curParticle.angle = angle
        let particles: ParticleSystem2D = this.curParticle.getChildByName("Particle").getComponent(ParticleSystem2D)
        this.paritcleDensety = particles.emissionRate / particles.posVar.y
        particles.posVar = new Vec2(particles.posVar.x, dist/2)
        particles.emissionRate = this.paritcleDensety * particles.posVar.y
    }

    public ColorLine(color: Color = null){
        if(color == null){
            console.log("null color");
            return
        }
        let coloredLine = instantiate(this.colorLine)
        coloredLine.parent = this.curLine
        coloredLine.position = new Vec3(0,0,0)
        
        coloredLine.getComponent(Sprite).color = color
        coloredLine.scale = new Vec3(0,0,0)
        tween(coloredLine)
        .to(1.5, {scale: new Vec3(1,1,1)})
        .start()
    }
}

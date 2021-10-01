
import { _decorator, Component, Node, Vec3, Graphics, Prefab, instantiate, Color, color, ParticleSystem2D, misc, Quat, Sprite, Vec2, tween, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Line')
export class Line extends Component {
    @property({type: Prefab}) corner: Prefab
    @property({type: Prefab}) particlePrefab:Prefab
    @property({type: Prefab}) line: Prefab
    @property({type: Prefab}) colorLinePrefab: Prefab
    @property({type: Prefab}) kinematicLinePrefab: Prefab
    point1: Vec3
    point2: Vec3
    slotColor: Color
    lineWidth: number

    public Initialize (x1: number, x2: number, y1: number, y2: number, slotColor: Color ,lineWidth: number){
        this.point1 = new Vec3(x1, -y1)
        this.point2 = new Vec3(x2, -y2)
        this.slotColor = new Color(slotColor)
        this.lineWidth = lineWidth
        //this.drawLine()
        this.drawKinematicLine()
        //this.DrawCorners()
    }

    private DrawCorner(color: Color, pos: Vec3){
        let corner :Node = instantiate(this.corner)
        corner.parent = this.node
        corner.position = pos
        //color.a = 100
        corner.getComponent(Sprite).color = color
        corner.scale = new Vec3(0,0,0)
        tween(corner).to(0.3, {scale: new Vec3(1,1,1)}).start()
    }

    curLine: Node
    curParticle: Node
    paritcleDensety: number
    private drawLine(){
        this.curLine = instantiate(this.line)
        this.curLine.getComponent(Sprite).color = new Color(44,65,95,255)
        this.curLine.parent = this.node
        this.curLine.position = this.point1

        let dist = Vec3.distance(this.point1, this.point2)
        this.curLine.setScale(new Vec3(1.2,dist/51,1))
        let diff = this.point1.subtract(this.point2)
        let angle = Math.atan2(diff.y, diff.x)
        angle = misc.radiansToDegrees(angle) + 90
        this.curLine.angle = angle
        this.point1.add(this.point2)
    }
    lineSkeleton: sp.Skeleton
    drawKinematicLine(){
        this.lineSkeleton = instantiate(this.kinematicLinePrefab).getComponent(sp.Skeleton)
        this.lineSkeleton.node.parent = this.node
        let bone1 = this.lineSkeleton.findBone("1")
        bone1.x = this.point1.x
        bone1.y = this.point1.y
        
        let bone2 = this.lineSkeleton.findBone("2")
        bone2.x = this.point2.x
        bone2.y = this.point2.y
    }

    st: string
    public colorLine(color: Color = null){
        if(color == null){
            console.log("null color");
            return
        }
        // let coloredLine = instantiate(this.colorLinePrefab)
        // coloredLine.parent = this.node
        // coloredLine.position = this.curLine.position
        // coloredLine.getComponent(Sprite).color = color
        // coloredLine.scale = new Vec3(0,0,0)
        // coloredLine.angle = this.curLine.angle
        // tween(coloredLine)
        // .to(1.5, {scale: this.curLine.scale})
        // .start()
        // this.node.position.add(new Vec3(0,0,1))
        // this.node.parent.children.sort((a,b) => a.position.z - b.position.z)

        this.st = this.GetColorString(color)
        this.lineSkeleton.setMix("white", this.st + "3", 0.5)
        this.lineSkeleton.setMix(this.st + "3", this.st, 0.5)
        this.lineSkeleton.setAnimation(0, this.st + "3", false)
        this.lineSkeleton.addAnimation(0, this.st, true)
    }

    public blinkLines(){
        this.lineSkeleton.setMix(this.st, this.st + "2", 0.5)
        this.lineSkeleton.setAnimation(0, this.st + "2", true)
    }

    GetColorString(color: Color): string{
        if(color.equals(new Color(255,0,0,255)))
            return "red"
        if(color.equals(new Color(0,125,255,255)))
            return "blue"
        if(color.equals(new Color(255,255,0,255)))
            return "yellow"
        if(color.equals(new Color(0,255,0,255)))
            return "green"
        if(color.equals(new Color(255,0,255,255)))
            return "purple"
        if(color.equals(new Color(255,165,0,255)))
            return "orange"
        return "gray"
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

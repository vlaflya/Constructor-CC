
import { _decorator, Component, Node, Prefab, Vec3, Color, instantiate, ParticleSystem2D, CCFloat, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ParticleMover')
export class ParticleMover extends Component {

    @property({type: CCFloat}) speed: number
    @property({type: Vec3}) points: Array<Vec3> = []
    @property({type: CCFloat}) maxDistance: number
    private currentTarget: number = 1
    public Inialize(points: Array<Vec3>, color: Color){
        this.points = points;
        this.node.getComponent(ParticleSystem2D).color = color
    }
    start(){
        this.node.setPosition(this.points[0])
    }
    update(dt){
        this.node.setPosition(this.node.position.lerp(this.points[this.currentTarget],dt * this.speed))
        if(Vec3.distance(this.node.position, this.points[this.currentTarget]) < this.maxDistance){
            this.NextPoint()
        }
    }
    NextPoint(){
        this.currentTarget++
        if(this.currentTarget == this.points.length)
            this.currentTarget = 0
    }
}

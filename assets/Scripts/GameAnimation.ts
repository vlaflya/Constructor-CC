
import { _decorator, Component, Node, sp, Skeleton, tween, easing, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameAnimation')
export class GameAnimation extends Component {
    @property({type: sp.Skeleton}) flower: sp.Skeleton
    @property({type: sp.Skeleton}) platform: sp.Skeleton
    @property({type: sp.Skeleton}) zebra: sp.Skeleton
    @property({type: Node}) posPlatform: Node
    @property({type: Node}) posFlower: Node

    start(){
        this.setMix(this.flower, "Idle_1", "In" , 5)
        this.setMix(this.flower, "In", "Idle_2" , 0.5)
        this.setMix(this.platform, "In", "Begin", 0.5)
        this.setMix(this.zebra, "Constructor_Idle", "Constructor_Happy-2", 0.5)
    }

    public endLevel(){
        this.platform.setAnimation(0,"In",false)
        tween(this.zebra.node)
        .delay(1)
        .to(0.5, {worldPosition: this.posPlatform.worldPosition}, {easing: "circIn"})
        .delay(0.2)
        .to(1, {worldPosition: this.posFlower.worldPosition}, {easing: "circInOut"})
        .call(() => {this.callback()}).start()
    }

    callback(){
        this.flower.setAnimation(0, "In", false)
        //this.flower.addAnimation(0, "Idle_2", true)
        this.zebra.setAnimation(0, "Constructor_Happy-2", true)
    }

    setMix(skeleton: sp.Skeleton, anim1, anim2, transitionTime: number){
        skeleton.setMix(anim1, anim2, transitionTime)
        skeleton.setMix(anim2, anim1, transitionTime)
    }
}


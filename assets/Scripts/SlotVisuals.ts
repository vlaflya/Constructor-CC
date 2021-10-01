
import { _decorator, Component, Node, Animation, sp, randomRange } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SlotVisuals')
export class SlotVisuals extends Component {
    onLoad () {
        let anim = this.node.getComponent(Animation)
        anim.clips[0].speed = randomRange(0.8, 2)
        console.log(anim.clips[0].speed)
    }
}
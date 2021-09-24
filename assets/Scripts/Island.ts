
import { _decorator, Component, Node, tween, Vec3, easing, find, sp, randomRange, randomRangeInt } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Island')
export class Island extends Component {
    @property({type: sp.Skeleton}) sk: sp.Skeleton
    private id: number

    public init(id: number){
        this.id = id
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
        this.sk.timeScale = randomRange(1, 1.5)
    }
    onTouch(){
        find("GameManager").getComponent(GameManager).load(this.id, this.node.worldPosition)
        tween(this.node).to(0.5, {scale:new Vec3(1.1,1.1,1)}, {easing:"bounceOutIn"}).start()
    }
}

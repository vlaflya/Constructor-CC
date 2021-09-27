
import { _decorator, Component, Node, tween, Vec3, easing, find, sp, randomRange, randomRangeInt } from 'cc';
import { GameManager } from './GameManager';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('Island')
export class Island extends Component {
    @property({type: sp.Skeleton}) sk: sp.Skeleton
    @property({type: Node}) waterfall: Node
    private id: number
    private isUnlocked: boolean

    public init(id: number, unlocked: boolean){
        this.id = id
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
        this.sk.timeScale = randomRange(1, 1.5)
        this.isUnlocked = unlocked
        if(unlocked){
            this.waterfall.active = true
            this.sk.setSkin("done")
        }
        else{
            this.waterfall.active = false
            this.sk.setSkin("Close")
        }
    }
    onTouch(){
        if(this.isUnlocked){
            SoundManager.Instance.setSound(this.node, "LevelTap", false, true)
            find("GameManager").getComponent(GameManager).load(this.id, this.node.worldPosition)
            tween(this.node).to(0.5, {scale:new Vec3(1.1,1.1,1)}, {easing:"bounceOutIn"}).start()
        }
    }
}

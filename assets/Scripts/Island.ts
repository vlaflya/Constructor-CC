
import { _decorator, Component, Node, tween, Vec3, easing, find, sp, randomRange, randomRangeInt, Tween } from 'cc';
import { GameManager } from './GameManager';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('Island')
export class Island extends Component {
    @property({type: sp.Skeleton}) sk: sp.Skeleton
    @property({type: Node}) waterfall: Node
    private id: number
    private isUnlocked: boolean

    public init(id: number, state: number){
        this.id = id
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
        this.sk.timeScale = randomRange(1, 1.5)
        if(state == 0 || state == 1){
            this.isUnlocked = true
            if(state == 0){
                this.waterfall.active = false
                this.sk.setSkin("Start")
            }
            else{
                this.waterfall.active = true
                this.sk.setSkin("done")
            }
        }
        else{
            this.isUnlocked = false
            this.waterfall.active = false
            this.sk.setSkin("Close")
        }
    }
    onTouch(){
        Tween.stopAllByTarget(this.node)
        tween(this.node).
        to(0.2, {scale:new Vec3(1.1,1.1,1)}, {easing:"bounceOut"}).
        to(0.2, {scale:new Vec3(1,1,1)}, {easing:"bounceIn"}).
        start()
        if(this.isUnlocked){
            SoundManager.Instance.setSound(this.node, "LevelTap", false, true)
            find("GameManager").getComponent(GameManager).load(this.id, this.node.worldPosition)
        }
        else
            SoundManager.Instance.setSound(this.node, "LevelTapDisable", false, true)
    }
}

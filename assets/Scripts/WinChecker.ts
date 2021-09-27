
import { _decorator, Component, Node, tween, Sprite, Color, find } from 'cc';
import { GameManager } from './GameManager';
import { FireflyController } from './FireflyController';
import { GameAnimation } from './GameAnimation';
import { SoundManager } from './SoundManager';

const { ccclass, property } = _decorator;

@ccclass('WinChecker')
export class WinChecker extends Component {
    @property({type: FireflyController}) controller: FireflyController
    @property({type: GameAnimation}) gameAnim: GameAnimation
    @property({type: Node}) finalParticle: Node
    needToWin: number
    winCount: number = 0
    public static Instance: WinChecker

    onLoad(){
        WinChecker.Instance = this
        find("GameManager").getComponent(GameManager).loadFlagAdd()
    }
    public Initialize(needWin: number){
        this.needToWin = needWin
    }
    public CheckWin(){
        this.winCount++
        if(this.winCount != this.needToWin)
            return
        this.controller.sing()
        this.gameAnim.endLevel()
        SoundManager.Instance.setSound(this.node, "Celebration", false, true)
        this.finalParticle.active = true
        find("GameManager").getComponent(GameManager).winCall()
        delay(5000).then(() => {this.exitLevel()})
    }
    public exitLevel(){
        find("GameManager").getComponent(GameManager).exitCall()
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

import { _decorator, Component, Node, tween, Sprite, Color, find, Vec3, easing } from 'cc';
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
    @property({type: Node}) container: Node
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
        find("GameManager").getComponent(GameManager).winCall()
        tween(this.node)
        .call(() =>{
            this.controller.blinkSlots()
            this.controller.sing()
            SoundManager.Instance.setSound(this.node, "Celebration", false, true)
        })
        .delay(0.5)
        .call(() =>{
            find("GameManager").getComponent(GameManager).voiceEnd()
        })
        .delay(1)
        .call(() =>{
            this.gameAnim.endLevel()
        })
        .delay(5)
        .call(() =>{
            this.exitLevel()
    
        })
        .start()
    }

    public exitLevel(){
        find("GameManager").getComponent(GameManager).exitCall()
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
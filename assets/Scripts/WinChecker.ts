
import { _decorator, Component, Node, tween, Sprite, Color, find } from 'cc';
import { GameManager } from './GameManager';
import { FireflyController } from './FireflyController';
import { GameAnimation } from './GameAnimation';

const { ccclass, property } = _decorator;

@ccclass('WinChecker')
export class WinChecker extends Component {
    @property({type: FireflyController}) controller: FireflyController
    @property({type: GameAnimation}) gameAnim: GameAnimation
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
        delay(5000).then(() => {this.winLevel()})
    }
    public exitLevel(){
        find("GameManager").getComponent(GameManager).exitCall()
    }
    public winLevel(){
        find("GameManager").getComponent(GameManager).winCall()
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
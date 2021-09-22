
import { _decorator, Component, Node, tween, Sprite, Color, find } from 'cc';
import { GameManager } from './GameManager';
import { FireflyController } from './FireflyController';
import { GameAnimation } from './GameAnimation';

const { ccclass, property } = _decorator;

@ccclass('WinChecker')
export class WinChecker extends Component {
    @property({type: Node}) levelWin: Node
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
        delay(5000).then(() => {this.levelWin.active = true})
        // this.levelWin.active = true
        //tween(this.levelWin.getComponent(Sprite)).to(1, {color: Color.WHITE}).start()
    }
    public LoadNextLevel(){
        find("GameManager").getComponent(GameManager).winCall()
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
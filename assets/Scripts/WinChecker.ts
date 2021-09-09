
import { _decorator, Component, Node, tween, Sprite, Color, find } from 'cc';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('WinChecker')
export class WinChecker extends Component {
    @property({type: Node}) levelWin: Node
    needToWin: number
    winCount: number = 0
    public static Instance: WinChecker

    onLoad(){
        WinChecker.Instance = this
        find("GameManager").getComponent(GameManager).sceneLoadCallback()
    }
    public Initialize(needWin: number){
        this.needToWin = needWin
    }
    public CheckWin(){
        this.winCount++
        if(this.winCount != this.needToWin)
            return
        this.levelWin.active = true
        //tween(this.levelWin.getComponent(Sprite)).to(1, {color: Color.WHITE}).start()
    }
    public LoadNextLevel(){
        find("GameManager").getComponent(GameManager).winCall()
    }
}
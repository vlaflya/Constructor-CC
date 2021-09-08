
import { _decorator, Component, Node, tween, Sprite, Color, find } from 'cc';
import { PersistantNode } from './PersistantNode';

const { ccclass, property } = _decorator;

@ccclass('WinChecker')
export class WinChecker extends Component {
    @property({type: Node}) levelWin: Node
    needToWin: number
    winCount: number = 0
    public static Instance: WinChecker

    onLoad(){
        WinChecker.Instance = this
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
        find("Persistant").getComponent(PersistantNode).ReloadLevel()
    }
}

import { _decorator, Component, Node, JsonAsset, game, director, Director, find } from 'cc';
import GeneralStateMachine from './GeneralStateMachine';
import { GridGenerator } from './GridGenerator';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type: [JsonAsset]}) configsProperty: Array<JsonAsset> = []
    private levelCount: number = 0
    stateMachine: GeneralStateMachine

    onLoad(){
        game.addPersistRootNode(this.node)
        this.stateMachine = new GeneralStateMachine(this, "game")
        this.stateMachine.addState("WaitForScene", {onEnter: this.onWaitForSceneEnter, onExit: this.onWaitForSceneExit})
        .addState("WaitForWin", {onEnter: this.onWaitForWinEnter, onExit: this.onWaitForWinExit})
        this.onWaitForSceneExit()
    }

    onWaitForSceneEnter(){
        //this.node.on(Director.EVENT_AFTER_SCENE_LAUNCH, this.sceneLoadCallback)
    }
    sceneLoadCallback(){
        console.log("loaded");
        this.stateMachine.exitState()
    }
    onWaitForSceneExit(){
        this.node.off(Director.EVENT_AFTER_SCENE_LAUNCH, this.sceneLoadCallback)
        find("Canvas/GridGeneration").getComponent(GridGenerator).init(this.configsProperty[this.levelCount])
        this.stateMachine.setState("WaitForWin")
    }
    onWaitForWinEnter(){

    }
    winCall(){
        this.stateMachine.exitState()
    }
    onWaitForWinExit(){
        this.stateMachine.setState("WaitForScene")
        this.ReloadLevel()
    }

    public ReloadLevel(){
        this.levelCount++
        if(this.levelCount == this.configsProperty.length)
            this.levelCount = 0
        director.loadScene("scene")
    }
}


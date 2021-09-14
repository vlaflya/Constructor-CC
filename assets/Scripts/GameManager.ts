
import { _decorator, Component, Node, JsonAsset, game, director, Director, find } from 'cc';
import GeneralStateMachine from './GeneralStateMachine';
import { GridGenerator } from './GridGenerator';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private levelCount: number = 0
    stateMachine: GeneralStateMachine
    private path: string = "https://api.github.com/repos/vlaflya/ConstructorConfigs/contents"
    private names: Array<string> = []
    private levelConfigs: Array<LevelConfig> = []

    onLoad(){
        game.addPersistRootNode(this.node)
        this.stateMachine = new GeneralStateMachine(this, "game")
        this.stateMachine.addState("WaitForScene", {onEnter: this.onWaitForSceneEnter, onExit: this.onWaitForSceneExit})
        .addState("WaitForWin", {onEnter: this.onWaitForWinEnter, onExit: this.onWaitForWinExit})
        this.loadLevelNames(this.path)
    }

    loadLevelNames(url){
        fetch(url)
        .then(res => res.json())
        .then((out) => {
            for(let i = 0; i < out.length; i++){
                this.names.push(out[i].name)
            }
        })
        .then(() => {this.readLevels()})
        .catch(err => { throw err });
    }

    readLevels(){
        this.names.forEach(name => {
            console.log(this.path + "/" + name)
            let level = this.loadLevels(this.path + "/" + name)
        });
    }
    
    loadLevels(url){
        let st: string
        fetch(url)
        .then(res => res.json())
        .then((out) => {
            let conf: LevelConfig = {}
            st = out.content
            st = atob(st)
            conf.levelSt = st

            let inf: LevelInformation = JSON.parse(st)[0]
            // console.log(inf.levelnum);
            conf.levelInf = inf

            this.levelConfigs.push(conf)
        })
        .then(() => {this.levelsLoadedCheck()}) 
        .catch(err => { throw err });
    }

    loadCount: number = 1
    levelsLoadedCheck(){
        this.loadCount++
        if(this.loadCount == this.names.length)
            this.sortArray()
    }
    sortArray(){
        this.levelConfigs = this.levelConfigs.sort((n1, n2) => {
            if(n1.levelInf.levelnum > n2.levelInf.levelnum)
                return 1
            if(n1.levelInf.levelnum < n2.levelInf.levelnum)
                return -1
            return 0
        })
        this.levelConfigs.forEach(element => {
            console.log(element.levelInf.levelnum);
        });
        this.onWaitForSceneExit()
    }

    onWaitForSceneEnter(){
        //this.node.on(Director.EVENT_AFTER_SCENE_LAUNCH, this.sceneLoadCallback)
    }
    sceneLoadCallback(){
        console.log("loaded");
        if(this.stateMachine != null)
            this.stateMachine.exitState()
    }
    onWaitForSceneExit(){
        this.node.off(Director.EVENT_AFTER_SCENE_LAUNCH, this.sceneLoadCallback)
        find("Canvas/GridGeneration").getComponent(GridGenerator).init(this.levelConfigs[this.levelCount].levelSt)
        this.stateMachine.setState("WaitForWin")
    }
    onWaitForWinEnter(){

    }
    winCall(){
        this.stateMachine.exitState()
    }
    onWaitForWinExit(){
        this.stateMachine.setState("WaitForScene")
        this.reloadLevel()
    }

    public reloadLevel(){
        this.levelCount++
        if(this.levelCount == this.levelConfigs.length)
            this.levelCount = 0
        director.loadScene("scene")
    }
}

async function Get() {
    
}

interface LevelConfig{
    levelSt?: string
    levelInf?: LevelInformation
}

export interface LevelInformation{
    availablecolors: string
    levelnum: number
    fireflycolors: string
    slotcount: number
}


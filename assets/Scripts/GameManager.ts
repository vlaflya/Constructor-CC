
import { _decorator, Component, Node, JsonAsset, game, director, Director, find } from 'cc';
import GeneralStateMachine from './GeneralStateMachine';
import { GridGenerator } from './GridGenerator';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private levelCount: number = 0
    stateMachine: GeneralStateMachine
    private repoPath: string = "https://api.github.com/repos/vlaflya/ConstructorConfigs/contents"
    private currentLevel: string
    private names: Array<string> = []

    onLoad(){
        game.addPersistRootNode(this.node)
        this.stateMachine = new GeneralStateMachine(this, "game")
        this.stateMachine.addState("WaitForScene", {onEnter: this.onWaitForSceneLoadEnter, onExit: this.onWaitForSceneLoadExit})
        .addState("WaitForWin", {onEnter: this.onWaitForWinEnter, onExit: this.onWaitForWinExit})
        this.loadLevelNames(this.repoPath + "/index.json")
    }

    loadLevelNames(url){
        fetch(url)
        .then(res => res.json())
        .then((out) => {
            let st = atob(out.content)
            let lvls: levelsRead = JSON.parse(st)
            st = lvls.levels
            let name: string = ""
            for(let c = 0; c < st.length; c++){
                if(st[c] == ","){
                    this.names.push(name)
                    name = ""
                    continue
                }
                name += st[c]
            }
            this.names.push(name)
        })
        .then(() => {this.stateMachine.setState("WaitForScene")})
        .catch(err => { throw err });
    }
    
    onWaitForSceneLoadEnter(){
        this.loadLevel(this.repoPath + "/" + this.names[this.levelCount] + ".json")
    }

    loadLevel(url){
        fetch(url)
        .then(res => res.json())
        .then((out) => {
            this.currentLevel = atob(out.content)
        })
        .then(() => {
            console.log(this.names[this.levelCount])
            this.loadFlagAdd()
        })
        .catch(err => { throw err });
    }
    flagCount = 0
    public loadFlagAdd(){
        this.flagCount++
        if(this.flagCount == 2)
            this.stateMachine.exitState()
    }

    onWaitForSceneLoadExit(){
        find("Canvas/GridGeneration").getComponent(GridGenerator).init(this.currentLevel)
        this.stateMachine.setState("WaitForWin")
    }

    onWaitForWinEnter(){

    }

    winCall(){
        this.stateMachine.exitState()
    }
    
    onWaitForWinExit(){
        this.reloadLevel()
        this.stateMachine.setState("WaitForScene")
    }

    public reloadLevel(){
        this.levelCount++
        if(this.levelCount == this.names.length)
            this.levelCount = 0
        this.flagCount = 0
        director.loadScene("scene")
    }
}

interface levelsRead{
    levels: string
}



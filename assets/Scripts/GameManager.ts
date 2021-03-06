
import { _decorator, Component, Node, JsonAsset, game, director, Director, find, UITransform, UI, tween, Tween, Vec3 } from 'cc';
import GeneralStateMachine from './GeneralStateMachine';
import { GridGenerator } from './GridGenerator';
import { LevelMap } from './LevelMap';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type: UITransform}) transitionCircle: UITransform
    stateMachine: GeneralStateMachine
    private repoPath: string = "https://api.github.com/repos/vlaflya/ConstructorConfigs/contents"
    private currentLevel: string
    //private names: Array<string> = []
    private lvls: Array<levelRead> = []

    onLoad(){
        game.addPersistRootNode(this.node)
        this.stateMachine = new GeneralStateMachine(this, "game")
        this.stateMachine
        .addState("WaitForMap", {onEnter: this.waitForMapEnter, onExit: this.waitForMapExit})
        .addState("LevelMap", {onEnter: this.levelMapEnter, onExit: this.levelMapExit})
        .addState("WaitForScene", {onEnter: this.onWaitForSceneLoadEnter, onExit: this.onWaitForSceneLoadExit})
        .addState("WaitForWin", {onEnter: this.onWaitForWinEnter, onExit: this.onWaitForWinExit})
        this.stateMachine.setState("WaitForMap")
        this.loadLevelNames(this.repoPath + "/index_test.json")
    }

    public getName(id: number): string{
        return this.lvls[id].name
    }

    mapLoaded: boolean = false
    namesLoaded: boolean = false
    
    loadLevelNames(url){
        fetch(url)
        .then(res => res.json())
        .then((out) => {
            this.lvls = JSON.parse(atob(out.content))
        })
        .then(() => {
            this.namesLoaded = true
            this.checkLoaded()
        })
        .catch(err => { throw err });
    }
    
    loading: boolean = false
    lastLevelID:number = 0

    waitForMapEnter(){
        
    }

    mapLoad(){
        this.mapLoaded = true
        this.checkLoaded()
    }

    checkLoaded(){
        if(this.mapLoaded && this.namesLoaded){
            this.mapLoaded = false
            this.stateMachine.exitState()
        }
    }

    waitForMapExit(){
        this.transitionOut()
        this.stateMachine.setState("LevelMap")
    }

    private levelCount: number = 0
    private lastLevelUnlocked: number = 0
    levelMapEnter(){
        let map: LevelMap = find("MapCanvas/LevelMap").getComponent(LevelMap)
        map.init(this.lvls.length, this.lastLevelID, this.levelCount, (this.lastLevelID == this.lastLevelUnlocked))
        if(this.lastLevelUnlocked != this.levelCount)
            this.lastLevelUnlocked++
    }

    load(id: number, pos: Vec3){
        if(!this.loading){
            this.loading = true
            this.lastLevelID = id
            find("MapCanvas/LevelMap").getComponent(LevelMap).focusOnIsland(pos, id)
        }
    }

    levelMapExit(id?: number){
        this.stateMachine.setState("WaitForScene", id)
    }

    curLvlID: number
    onWaitForSceneLoadEnter(id?: number){
        if(id == null){
            console.warn("null level id")
            return
        }
        this.curLvlID = id
        find("MapCanvas").active = false
        find("Canvas").active = true
        this.loading = false
        let sc = this.repoPath + "/" + this.lvls[id].name + ".json"
        console.log(sc);
        this.loadLevel(sc)
    }

    loadLevel(url){
        fetch(url)
        .then(res => res.json())
        .then((out) => {
            this.currentLevel = atob(out.content)
        })
        .then(() => {
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
        SoundManager.Instance.setSound(find("Canvas"), "Ambient", true, true)
        find("Canvas/GridGeneration").getComponent(GridGenerator).init(this.currentLevel)
        this.stateMachine.setState("WaitForWin")
        this.transitionOut()
    }

    onWaitForWinEnter(){
        SoundManager.Instance.addVoice(this.lvls[this.curLvlID].startVoice)
    }
    voiceEnd(){
        SoundManager.Instance.addVoice(this.lvls[this.curLvlID].endVoice)
    }
    winCall(){
        if(this.levelCount == this.lastLevelID)
            this.levelCount++
    }
    exitCall(){
        this.transitionIn()
    }
    transitioning: boolean = false
    transitionIn(id?, pos: Vec3 = new Vec3(0,0,0)){
        if(!this.transitioning){
            console.log("in");
            this.transitioning = true
            this.transitionCircle.node.active = true
            Tween.stopAllByTarget(this.transitionCircle)
            if(!pos.equals(new Vec3(0,0,0))){
                tween(this.transitionCircle.node)
                .to(1, {worldPosition: pos}).start()
            }
            else{
                tween(this.transitionCircle.node)
                .to(1, {position: new Vec3(0,0,0)}).start()
            }
            tween(this.transitionCircle)
            .to(1, {width: 0, height: 0})
            .call(() => {
                this.stateMachine.exitState(id)
                this.transitioning = false
            })
            .start()
        }
    }
    transitionOut(){
        console.log("out")
        tween(this.transitionCircle.node)
        .to(1, {position: new Vec3(0,0,0)}).start()

        tween(this.transitionCircle)
        .to(1,{width: 2000, height: 2000})
        .call(() => {
        this.transitionCircle.node.active = false
        })
        .start()
    }
    
    onWaitForWinExit(){
        this.flagCount = 0
        director.loadScene("scene")
        this.stateMachine.setState("WaitForMap")
    }
}

interface levelRead{
    name: string
    startVoice: string
    endVoice: string
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
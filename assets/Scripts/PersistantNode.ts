
import { _decorator, Component, Node, game, JsonAsset, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PersistantNode')
export class PersistantNode extends Component {
    @property({type: [JsonAsset]}) configsProperty: Array<JsonAsset> = []
    private configs: Array<JsonAsset>
    public static Instance: PersistantNode = null
    private levelCount: number = 0
    
    onLoad(){
        if(PersistantNode.Instance == null)
            PersistantNode.Instance = this
        game.addPersistRootNode(this.node)
    }
    public ReloadLevel(){
        this.levelCount++
        director.loadScene("scene")
    }
    public GetConfig(): JsonAsset{
        console.log(this.levelCount)
        if(this.levelCount == this.configsProperty.length)
            this.levelCount = 0
        return this.configsProperty[this.levelCount]
    }
}

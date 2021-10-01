
import { _decorator, Component, Node, tween, Vec3, easing, find, sp, randomRange, randomRangeInt, Tween, Sprite, SpriteFrame, Texture2D, path, assetManager, Asset, loader, ImageAsset, color } from 'cc';
import { GameManager } from './GameManager';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('Island')
export class Island extends Component {
    @property({type: sp.Skeleton}) sk: sp.Skeleton
    @property({type: Node}) waterfall: Node
    @property({type: Sprite}) picktogram: Sprite
    private id: number
    private isUnlocked: boolean
    private imageRepo: string = "https://raw.githubusercontent.com/vlaflya/ConstructorImages/master/"

    public init(id: number, state: number){
        this.id = id
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
        this.sk.timeScale = randomRange(1, 1.5)
        if(state == 0 || state == 1){
            this.isUnlocked = true
            if(state == 0){
                this.waterfall.active = false
                this.sk.setSkin("Start")
            }
            else{
                this.setPicktogram()
                this.waterfall.active = true
                this.sk.setSkin("done")
            }
        }
        else{
            this.isUnlocked = false
            this.waterfall.active = false
            this.sk.setSkin("Close")
        }
    }

    setPicktogram(){
        let name: string = find("GameManager").getComponent(GameManager).getName(this.id)
        let url:string = this.imageRepo + name + ".png"
        let pick = this.picktogram
        assetManager.loadRemote(url, function(err, textureLoad: ImageAsset){
            console.log(textureLoad)
            let texture: Texture2D = textureLoad._texture
            let frame: SpriteFrame = new SpriteFrame()
            frame.texture = texture
            console.log(frame.texture)
            pick.spriteFrame = frame
        })
    }

    onTouch(){
        Tween.stopAllByTarget(this.node)
        tween(this.node).
        to(0.2, {scale:new Vec3(1.1,1.1,1)}, {easing:"bounceOut"}).
        to(0.2, {scale:new Vec3(1,1,1)}, {easing:"bounceIn"}).
        start()
        if(this.isUnlocked){
            SoundManager.Instance.setSound(this.node, "LevelTap", false, true)
            find("GameManager").getComponent(GameManager).load(this.id, this.node.worldPosition)
        }
        else
            SoundManager.Instance.setSound(this.node, "LevelTapDisable", false, true)
    }
}


import { _decorator, Component, Node, AudioSource, AudioClip, instantiate, find, game, assetManager, path } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
    @property({type: [AudioClip]}) clips: Array<AudioClip> = []
    private repoPath = "https://raw.githubusercontent.com/vlaflya/ConstructorAudio/master/"
    private audioMap: Map<string, AudioClip> = new Map
    public static Instance: SoundManager 
    onLoad(){
        game.addPersistRootNode(this.node)
        SoundManager.Instance = this
        this.createMap()
        SoundManager.Instance.setSound(this.node, "MainTheme", true, true)
    }
    public addVoice(path: string){
        let url = this.repoPath + path + ".ogg"
        let node = this.node
        assetManager.loadRemote(url, function(err, audioLoad: AudioClip){
            let sourceNode = node.getChildByName("Voice")
            if(sourceNode != null)
                sourceNode.destroy()
            sourceNode = instantiate(new Node("Voice"))
            let source = sourceNode.addComponent(AudioSource)
            source.clip = audioLoad
            source.loop = false
            source.play()
        })
    }
    createMap(){
        this.clips.forEach(clip => {
            let key: string = clip.name
            this.audioMap.set(key, clip)
            console.log(key)
        });
    }
    setSound(node: Node, key: string, loop: boolean, isSingle: boolean){
        let source: AudioSource
        let sourceNode: Node = node.getChildByName("Audio")

        if(sourceNode != null && isSingle){
            sourceNode.destroy()
        }
        sourceNode = instantiate(new Node("Audio"))
        sourceNode.parent = node
        source = sourceNode.addComponent(AudioSource)
        source.clip = this.audioMap.get(key)
        source.loop = loop
        source.play()
    }
    removeSound(node: Node){
        let sourceNode: Node = node.getChildByName("Audio")

        if(sourceNode != null){
            console.log("deleted")
            sourceNode.destroy()
        }   
    }
}



import { _decorator, Component, Node, AudioSource, AudioClip, instantiate, find, game } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
    @property({type: [AudioClip]}) clips: Array<AudioClip> = []
    private audioMap: Map<string, AudioClip> = new Map
    public static Instance: SoundManager 
    onLoad(){
        game.addPersistRootNode(this.node)
        SoundManager.Instance = this
        this.createMap()
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
        console.log(sourceNode.name)
        source.clip = this.audioMap.get(key)
        source.loop = loop
        console.log(source.volume)
        source.play()
        console.log(source.playing)
    }
    removeSound(node: Node){
        let sourceNode: Node = node.getChildByName("Audio")

        if(sourceNode != null){
            sourceNode.destroy()
        }   
    }
}


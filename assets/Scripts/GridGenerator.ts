
import { _decorator, Component, CCInteger, UITransform, Prefab, director, instantiate, Vec3, Node, RichText, JsonAsset, js, random, randomRange, Color, Vec2, CCFloat, ParticleSystem2D, Quat, Graphics, Sprite, color, randomRangeInt, find } from 'cc';

import { Line } from './Line';
import { Slot } from './Slot';
import { FireflyController } from './FireflyController';
import { ColorChanger } from './ColorChanger';
import { WinChecker } from './WinChecker';
import { Firefly } from './Firefly';
const { ccclass, property } = _decorator;

@ccclass('GridGenerator')
export class GridGenerator extends Component {
    config: JsonAsset = null!
    
    @property({type: UITransform}) container: UITransform = null!
    @property({type: UITransform}) lineContainer: UITransform = null!
    @property({type: UITransform}) slotContainer: UITransform = null!
    @property({type: FireflyController}) controller: FireflyController
    @property({type: ColorChanger}) colorChanger: ColorChanger
    @property({type: Prefab}) fireflyPrefab: Prefab
    @property({type: Prefab}) slotPrefab: Prefab
    @property({type: Prefab}) linePrefab:Prefab
    @property({type: Prefab}) cornerPoint: Prefab
    @property({type: CCFloat}) lineWidth: number
    @property({type: [Node]}) roamPoints: Array<Node> = []
    @property({type: CCInteger}) fliesAtOnes: number

    private scale: number
    private gridSlots: Array<Vec3>
    private fireflyInfo: FireflyInformation = null
    private slots: Array<Slot>
    private lines: Array<Line>
    private levelInfo: LevelInformation

    private paramCount: number = 1

    init(conf: JsonAsset){
        this.config = conf
        this.scale = this.container.height / 100
        this.CreateGrid(this.container)
    }

    private CreateGrid(zone?: UITransform){
        let readResult: Array<any> = this.ReadConfig()
        this.ReadLevelInfo(readResult)
        this.ReadSlots(readResult)
        this.ReadLines(readResult)
        this.SpawnFireflyes()
    }
    private ReadConfig(){
        let st: string = JSON.stringify(this.config.json)
        let readObjects: Array<any>
        return readObjects = JSON.parse(st)
    }
    private ReadLevelInfo(readObjects: Array<any>){
        this.levelInfo = readObjects[0]
        let colors: Array<Color> = []
        let colorString = ""
        for(let c = 0; c < this.levelInfo.availablecolors.length; c++){
            let ch = this.levelInfo.availablecolors[c]
            if(ch == ","){
                if(colorString == "none"){
                    this.colorChanger.node.destroy()
                    break
                }
                colors[colors.length] = this.ReadColor(colorString)
                colorString = ""
                continue
            }
            colorString += ch
        }
        if(colorString == "none"){
            this.colorChanger.node.destroy()
        }
        colors[colors.length] = this.ReadColor(colorString)
        this.colorChanger.Initialize(colors)
    }
    private ReadSlots(readObjects: Array<any>){
        this.slots = new Array<Slot>()
        let slotCount:number = 0
        for(let i = this.paramCount; i < this.levelInfo.slotcount + this.paramCount; i++){
            let readString: ReadSlot
            readString = readObjects[i]

            let c = 0
            //Index
            let id: string = ""
            for(;c < readString.slot.length; c++){
                if(readString.slot[c] == ",")
                    break
                id+= readString.slot[c]
            }
            c++
            //Type
            let type: number = readString[c]
            c+=2
            //Color
            let colorString: string = ""
            for(;c < readString.slot.length; c++){
                if(readString.slot[c] == ",")
                    break
                colorString+= readString.slot[c]
            }
            c++
            let color:Color = new Color(255,255,255,255)
            color = this.ReadColor(colorString)
            
            //isLit
            let isLit: boolean = false
            switch(readString.slot[c]){
                case "0": {
                    isLit = false
                    break
                }
                case "1":{
                    isLit = true
                    break
                }
            }
            c+= 2
            //XPosition
            let x: number
            let xString: string = ""
            for(;c < readString.slot.length; c++){
                if(readString.slot[c] == ",")
                    break
                xString += readString.slot[c]
            }
            
            c++
            x = Number(xString)
            //YPosition
            let y: number
            let yString: string = ""
            for(;c < readString.slot.length; c++){
                if(readString.slot[c] == ",")
                    break
                yString += readString.slot[c]
            }
            c++
            y = Number(yString)

            let slotNode: Node = instantiate(this.slotPrefab)
            slotNode.parent = this.slotContainer.node
            let slot = slotNode.getComponent(Slot)
            slot.Initialize(id,type,color, isLit, x * this.scale, y * this.scale)


            this.slots[slotCount] = slot

            slotCount++
        }
        this.controller.SetSlots(this.slots)
        WinChecker.Instance.Initialize(this.slots.length)
    }
    private ReadLines(readObjects: Array<any>){
        this.lines = new Array<Line>()
        let lineCount = 0
        for(let i = this.levelInfo.slotcount + this.paramCount; i < readObjects.length; i++){
            let readString: ReadLine = readObjects[i]
            let c = 0
            //x1
            let x1: number
            let x1String: string = ""
            for(; c < readString.line.length; c++){
                if(readString.line[c] == ",")
                    break
                x1String += readString.line[c]
            }
            c++
            x1 = Number(x1String)
            
            //y1
            let y1: number
            let y1String: string = ""
            for(; c < readString.line.length; c++){
                if(readString.line[c] == ",")
                    break
                y1String += readString.line[c]
            }
            c++
            y1 = Number(y1String)

            //x2
            let x2: number
            let x2String: string = ""
            for(; c < readString.line.length; c++){
                if(readString.line[c] == ",")
                    break
                x2String += readString.line[c]
            }
            c++
            x2 = Number(x2String)

            //y2
            let y2: number
            let y2String: string = ""
            for(; c < readString.line.length; c++){
                if(readString.line[c] == ",")
                    break
                y2String += readString.line[c]
            }
            c++
            y2 = Number(y2String)
            let slotID: string = ""
            for(; c < readString.line.length; c++){
                slotID += readString.line[c]
            }
            let color: Color
            let slot: Slot
            this.slots.forEach(sl => {
                if(sl.GetID() == slotID){
                    color = sl.GetColor()
                    slot = sl
                }
            });
            let lineNode = instantiate(this.linePrefab)
            lineNode.parent = this.lineContainer.node
            let line: Line = lineNode.getComponent(Line)
            line.Initialize(x1 * this.scale, x2 * this.scale, y1 * this.scale, y2 * this.scale, color, this.lineWidth)
            this.lines[lineCount] = line
            slot.AddLine(line)
            lineCount++
        }
    }
    insideWhenSpawned: number = 0
    private SpawnFireflyes(){
        let st: string = this.levelInfo.fireflycolors
        let colorString: string = ""
        
        for(let c = 0; c < st.length; c++){
            if(st[c] == ","){
                this.Spawn(colorString)
                colorString = ""
                continue
            }
            colorString += st[c]
        }
        this.Spawn(colorString)
        this.controller.SpawnEnded()
    }
    s: number = 0
    private Spawn(colorString: string){
        let fly: Firefly = instantiate(this.fireflyPrefab).getComponent(Firefly)
        fly.node.parent = this.container.node
        fly.node.position = this.slots[this.s].position
        this.s++
        if(this.insideWhenSpawned < this.fliesAtOnes){
            fly.Initialize(false, this.roamPoints, this.ReadColor(colorString), true)
            this.insideWhenSpawned++
            return
        }
        fly.Initialize(false, this.roamPoints, this.ReadColor(colorString), false)
        this.controller.addOutsideArray(fly)
        this.insideWhenSpawned++
    }
    private ReadColor(colorString: string): Color{
        switch(colorString){
            case("green"):{
                return(new Color(0,255,0,255))
            }
            case("red"):{
                return(new Color(255,0,0,255))
            }
            case("yellow"):{
                return(new Color(255,255,0,255))
            }
            case("blue"):{
                return(new Color(0,125,255,255))
            }
            case("orange"):{
                return(new Color(255,165,0,255))
            }
        }
        return Color.BLACK
    }
}
interface ReadSlot{
    slot: string
}
interface ReadLine{
    line: string
}
interface LevelInformation{
    availablecolors: string
    fireflycount: number
    fireflycolors: string
    slotcount: number
}

interface FireflyInformation{
    fireflyMinSpeed: number
    fireflyMaxSpeed: number
    fireflyMinSize: number
    fireflyMaxSize: number
}


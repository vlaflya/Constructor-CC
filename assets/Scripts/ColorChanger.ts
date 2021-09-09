
import { _decorator, Component, Node, Color, color, random, randomRange, randomRangeInt, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ColorChanger')
export class ColorChanger extends Component {
    colors: Array<Color> = []
    @property({type: Sprite}) sprite: Sprite
    colorCount: number = 0
    public Initialize(colors: Array<Color>){
        this.colors = colors
        this.sprite.color = colors[0]
    }
    public GetNextColor(): Color{
        let color = this.colors[this.colorCount]
        this.colorCount++
        if(this.colorCount == this.colors.length)
            this.colorCount = 0
        this.sprite.color = this.colors[this.colorCount]
        return color
    }
}

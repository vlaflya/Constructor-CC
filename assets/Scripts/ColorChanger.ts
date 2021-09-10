
import { _decorator, Component, Node, Color, color, random, randomRange, randomRangeInt, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ColorChanger')
export class ColorChanger extends Component {
    colors: Array<Color> = []
    colorCount: number = 0
    public Initialize(colors: Array<Color>){
        this.colors = colors
    }
    public GetNextColor(color: Color): Color{
        let i = 0
        this.colors.forEach(c => {
            if(c.equals(color))
                i = this.colors.indexOf(c) + 1
                return
        });
        if(i == this.colors.length)
            i = 0
        return this.colors[i]
    }
}

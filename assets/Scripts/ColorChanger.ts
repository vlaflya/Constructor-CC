
import { _decorator, Component, Node, Color, color, random, randomRange, randomRangeInt } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ColorChanger')
export class ColorChanger extends Component {
    colors: Array<Color> = []
    public Initialize(colors: Array<Color>){
        this.colors = colors
    }
    public GetRandomColor(color: Color): Color{
        let arrayClone: Array<Color> = []
        this.colors.forEach(c => {
            if(c.equals(color))
                return
            arrayClone[arrayClone.length] = c
        });
        let ret: Color = arrayClone[randomRangeInt(0, arrayClone.length)]
        return ret
    }
}

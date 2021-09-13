
import { _decorator, Component, Node, sp, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FireflyAnimation')
export class FireflyAnimation extends Component {
    @property({type: sp.Skeleton}) animation: sp.Skeleton

    onLoad(){
        this.setMix("1_Loop_free", "2_Selected", 0.2)
        this.setMix("2_Selected", "3_Loop_inserted", 0.5)
    }

    public SetColor(color: Color){
        this.animation.setSkin(this.GetColorString(color))
    }

    public SetSelect(selected: boolean){
        
        if(selected == true)
            this.animation.setAnimation(0, "2_Selected", true)
        else
            this.animation.setAnimation(0,"1_Loop_free", true)
    }

    public Lock(){
        this.animation.setAnimation(0, "3_Loop_inserted", true)
    }
    
    GetColorString(color: Color): string{
        if(color.equals(new Color(255,0,0,255)))
            return "red"
        if(color.equals(new Color(0,125,255,255)))
            return "blue"
        if(color.equals(new Color(255,255,0,255)))
            return "yellow"
        if(color.equals(new Color(0,255,0,255)))
            return "green"    
        return "gray"
    }

    setMix(anim1, anim2, transitionTime: number){
        this.animation.setMix(anim1, anim2, transitionTime)
    }
}

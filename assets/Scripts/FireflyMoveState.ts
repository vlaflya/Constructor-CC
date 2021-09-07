
import { _decorator, Component, Node, CCFloat, Vec3, tween, Color, color } from 'cc';
import { Firefly } from './Firefly';
import { FireflyController } from './FireflyController';
const { ccclass, property } = _decorator;

@ccclass('FireflyMoveState')
export class FireflyMoveState extends Component {
    @property({type: CCFloat}) moveTime: number
    firefly: Firefly
    canMove: boolean = true

    public Initialize(firefly: Firefly){
        this.firefly = firefly
    }
    
    public Move(pos: Vec3){
        if(this.canMove){
            this.canMove = false
            console.log(this.canMove);
            tween(this.node).to(this.moveTime, {worldPosition: pos}).start()
            this.Checks()
        }
    }
    async Checks(){
        await new Promise(f => setTimeout(f, this.moveTime * 1000));
        this.canMove =  !FireflyController.Instance.CheckConnection(this.firefly)
        this.canMove =  !FireflyController.Instance.CheckColorChange(this.firefly)
    }
    public Lock(pos: Vec3){
        tween(this.node).to(0.5 ,{worldPosition : pos}).start()
        this.firefly.Lock()
        this.enabled = false
        //this.LockDelay()
    }
    async LockDelay(){
        await new Promise(f => setTimeout(f, this.moveTime * 1000));
        // this.firefly.Lock()
    }
    public ChangeColor(color: Color, pos: Vec3){
        tween(this.node).to(0.5 ,{worldPosition : pos}).start()
        this.ColorDelay(color)
    }
    async ColorDelay(color: Color){
        await new Promise(f => setTimeout(f, 500));
        this.firefly.SetColor(color)
        this.canMove = true
    }
    public StopMove(){
        this.firefly.StartRoam()
    }
}


import { _decorator, Component, Node } from 'cc';
import GeneralStateMachine from './GeneralStateMachine';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    stateMachine: GeneralStateMachine

    start(){
        this.stateMachine = new GeneralStateMachine(this, "game")
    }
}


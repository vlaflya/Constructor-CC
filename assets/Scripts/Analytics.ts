
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Analytics')
export class Analytics extends Component {

    private playTime = 0
    private playTimeInt = 0

    update(deltaTime: number) {
        this.playTime += deltaTime
        this.playTimeInt = Math.floor(this.playTime)
    }

    sendEvent(actionName: string, checkPoint: any, args: object | null = null) {
        var dict = {
            'CheckPoint': checkPoint,
            'GamePlayTime': this.playTimeInt,
            'TotalGamePlayTime': this.playTimeInt,
            'Status': this.ep_GameEndType,
            'Screen': this.ep_Screen,
            'Level': 1
        }

        if (args) {
            dict = Object.assign(dict, args)
        }

        console.log(`sendEvent ${actionName} ${JSON.stringify(dict)}`)
        if (window.Unity) {
            window.Unity.LOG_GAME_ANALYTICS(actionName, dict)
            window.Unity.SET_GAME_ANALYTICS_PROPERTIES(dict)
        }
    }
}
interface analyticsItem {
    key: string;
    valu: number;
}

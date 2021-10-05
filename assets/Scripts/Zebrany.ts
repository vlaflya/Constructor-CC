
import { _decorator, Component, Node, director } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Zebrany')
export class Zebrany extends Component {

    @property initOnAwake: boolean = true

    start() {
        if (this.initOnAwake) {
            window.Game = window.Game || {}; // объект общения с игрой
            (function () {
                var timer = setInterval(function () {
                    console.log(`Zebrany: start ${window.Unity} :: ${window.Unity?.READY}`)
                    if (window.Unity && window.Unity.READY) {
                        window.Game.INITIALIZE = function (args) {
                            // в этом месте можно получить из args набор параметров
                            //
                            console.log("Zebrany: initializing!", args)
                            console.log(args)

                            window.Unity.START() // запускаем игру, показываем экран
                        }
                        window.Unity.READY()
                        clearInterval(timer)
                    }
                }, 250)
            })()
        }

        window.Game.PAUSE = function () {
            console.log("paused")
            director.pause()
        }

        window.Game.UNPAUSE = function () {
            console.log("unpaused")
            director.resume()
        }
    }

    gameFinish() {
        if (window.Unity) window.Unity.GAME_END()
    }

    saveProgress(key: string) {
        if (window.Unity) {
            window.Unity.SAVE_PROGRESS("progress", function onSaved() {
                console.log("progress saved")
            })
        }
        else {
            console.log("Can't find window.Unity")
        }
    }

    setBackButtonVisible(visible: boolean) {
        if (window.Unity) {
            window.Unity.BACK_BUTTON_SET_VISIBLE(visible)
        }
    }
}
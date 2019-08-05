
const { ccclass, property } = cc._decorator;
import settingBasic from "../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    onLoad() {

        cc.director.preloadScene("loading");
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            settingBasic.game.currLevel = 1;
            cc.director.loadScene("loading");
        }, this)
    }
    start() {

    }

    // update (dt) {}
}

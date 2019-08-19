
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    restartBt: cc.Node = null;

    @property(cc.Node)
    homeBt: cc.Node = null;

    @property(cc.Node)
    helpBt: cc.Node = null;

    // onLoad () {}
    canvas: cc.Node = null;
    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.hideMenu, this);

        this.restartBt.on(cc.Node.EventType.TOUCH_END, this.restart, this);
        this.homeBt.on(cc.Node.EventType.TOUCH_END, this.home, this);
        this.helpBt.on(cc.Node.EventType.TOUCH_END, this.help, this);

        this.canvas = cc.find("Canvas");
    }

    // update (dt) {}

    hideMenu(event) {
        // console.log("==========hideMenu=========")
        let pos = this.node.position;
        cc.tween(this.node).then(
            cc.spawn(
                cc.fadeOut(0.5),
                cc.moveTo(0.5, cc.v2(pos.x - 1000, pos.y))
            )
        ).call(() => {
            this.node.getComponent(cc.Button).enabled = false;
            this.canvas.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.RESUME);
        }).start();

    }

    restart(event) {
        console.log("==========restart=========");
        settingBasic.fun.clearCurrDeath();
        cc.tween(this.node).then(cc.fadeOut(0.5)).call(() => {
            this.node.getComponent(cc.Button).enabled = false;
            this.canvas.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.RESTART);
        }).start();
    }

    home(event) {
        console.log("==========home=========")
    }

    help(event) {
        console.log("==========help=========")
    }
}

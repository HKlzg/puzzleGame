
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    menuNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    canvas: cc.Node = null;
    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.showMenu, this);
        this.canvas = cc.find("Canvas");
    }

    // update (dt) {}
    showMenu() {
        // console.log("==========showMenu=========");
        this.menuNode.active = true;
        let pos = this.menuNode.position;


        cc.tween(this.menuNode).then(
            cc.spawn(
                cc.moveTo(0.5, cc.v2(pos.x + 1000, pos.y)),
                cc.fadeIn(0.5),
            )
        ).call(() => {
            this.canvas.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.PAUSE);
            this.node.getComponent(cc.Button).enabled = true;
        }).start();

    }
}

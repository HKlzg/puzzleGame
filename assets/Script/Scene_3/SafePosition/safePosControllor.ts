
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    leopard: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    start() {

    }

    // update (dt) {}

    onCollisionEnter(other, self) {
        // console.log("========onCollisionEnter======groupIndex= "+other.node.groupIndex )
        if (other.node.groupIndex == 6) { //人 - 6
            this.leopard.emit(setting.gameEvent.leopardReduceState, true)
        }
    }
    onCollisionStay(other, self) {

    }
    onCollisionExit(other, self) {
        if (other.node.groupIndex == 6) {
            this.leopard.emit(setting.gameEvent.leopardReduceState, false)
        }
    }

}

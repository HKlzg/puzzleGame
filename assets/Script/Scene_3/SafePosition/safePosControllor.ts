
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    monster: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    start() {

    }

    // update (dt) {}

    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 6) { //人 - 6
            console.log("========Enter======safe= ")
            this.monster.emit(setting.gameEvent.monsterReduceState, true)
        }
    }
    onCollisionStay(other, self) {
        if (other.node.groupIndex == 6) { //人 - 6
            // console.log("========Enter======safe= ")
            this.monster.emit(setting.gameEvent.monsterReduceState, true)
        }
    }
    onCollisionExit(other, self) {
        if (other.node.groupIndex == 6) {
            console.log("========Exit=====danger= ")
            this.monster.emit(setting.gameEvent.monsterReduceState, false)
        }
    }

}

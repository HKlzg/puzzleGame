
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    monster: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    start() {

    }

    logicUpdate (dt) {}

    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 6) { //人 - 6
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
            this.monster.emit(setting.gameEvent.monsterReduceState, false)
        }
    }

}

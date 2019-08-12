
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    monster: cc.Node = null;
 
    start() {

    }

    // update (dt) {}
    //物理碰撞
    onPreSolve(contact, self, other) {
        if (other.node.groupIndex == 6) { //忽略 和人的碰撞
            contact.disabled = true;
        }
    }
    //传感器

    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 6) { //人 - 6

            this.monster.emit(setting.gameEvent.monsterReduceState, true)
        }
    }
    onCollisionStay(other, self) {
        if (other.node.groupIndex == 6) { //人 - 6
            this.monster.emit(setting.gameEvent.monsterReduceState, true)
        }
    }
    onCollisionExit(other, self) {
        if (other.node.groupIndex == 6) {
            this.monster.emit(setting.gameEvent.monsterReduceState, false)
        }
    }

}

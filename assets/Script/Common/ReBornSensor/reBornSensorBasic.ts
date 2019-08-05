
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 6) {
            let person: cc.Node = other.node;
            //和人碰撞
            let pos = person.position;
            pos = person.scaleX > 0 ? cc.v2(pos.x - 50, pos.y + 10) : cc.v2(pos.x + 50, pos.y + 10);
            person.emit(setting.gameEvent.brotherSetBornPos, pos);
        }
    }

}

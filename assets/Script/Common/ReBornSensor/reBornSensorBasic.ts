
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

@ccclass
export default class NewClass extends LogicBasicComponent {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    logicUpdate (dt) {}

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

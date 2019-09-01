import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {

    start() {

    }

    logicUpdate(dt) {
        let pos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO)
        if (pos.y <= 200) {
            this.node.destroy();
        }
    }

    onCollisionEnter(self, other) {
        if (other.node.groupIndex == 11) {
            //碰到fish  自己消失
            this.node.destroy();
        }
    }
    onCollisionStay(self, other) {

    }
    onCollisionExit(self, other) {

    }


}

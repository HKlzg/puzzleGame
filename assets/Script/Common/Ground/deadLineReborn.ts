
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";
@ccclass
export default class DeadLineBasic extends LogicBasicComponent {

    // onLoad () {}
    canvas: cc.Node = null;
    isContact: boolean = false;
    onLoad() {
        this.canvas = cc.find("Canvas");
    }
    start() {
    }

    logicUpdate (dt) {}
    onBeginContact(contact, self, other) {
        //和人物碰撞 
        if (other.node.groupIndex == 6 && !this.isContact) {
            this.canvas.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.REBORN);
            this.isContact = true;
        }
    }


}


const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    spiderNode: cc.Node = null;

    canvas: cc.Node = null;
    isContact: boolean = false;

    start() {
        this.canvas = cc.find("Canvas")
    }

    logicUpdate(dt) { }

    onCollisionEnter(other, self) {
        if (!this.isContact && other.node.groupIndex == 6) {
            let ctrl = this.spiderNode.getComponent("spiderControllor");
            let isDead = setting.game.State == setting.setting.stateType.REBORN;
            if (!isDead && ctrl && ctrl.isAttack()) {
                this.canvas.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.REBORN);
                this.canvas.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.RESTART);
                this.isContact = true;
            }
        }
    }

    onCollisionExit(other, self) {
        if (!this.isContact && other.node.groupIndex == 6) {
            this.isContact = false;
        }
    }
}

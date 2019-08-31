import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {

    canvas: cc.Node = null;
    start() {
        this.canvas = cc.find("Canvas");
    }
    //碰撞检测(传感器)
    onCollisionEnter(other, self) {
        //被下落的箱子 砸中
        if (other.node.groupIndex == 2) {
            let boxBody = other.node.getComponent(cc.RigidBody);
            if (boxBody.linearVelocity.y < -200) {
                this.canvas.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.REBORN);
                this.canvas.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.RESTART);
            }

        }
    }
    logicUpdate(dt) {

    }
}

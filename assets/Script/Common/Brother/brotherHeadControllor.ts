import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {

    currScene: cc.Node = null;
    start() {
        this.currScene = cc.find("Canvas/"+settingBasic.game.currScene);
    }
    //碰撞检测(传感器)
    onCollisionEnter(other, self) {
        //被下落的箱子 砸中
        if (other.node.groupIndex == 2) {
            let boxBody = other.node.getComponent(cc.RigidBody);
            if (boxBody.linearVelocity.y < -200) {
                 
                this.currScene.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.RESTART);
            }

        }
    }
    logicUpdate(dt) {

    }
}

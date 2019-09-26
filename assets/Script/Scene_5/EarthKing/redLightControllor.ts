import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {

    currScene: cc.Node = null;

    isContact: boolean = false;

    start() {
        this.currScene = cc.find("Canvas/" + settingBasic.game.currScene);
    }

    logicUpdate(dt) { }

    //碰撞检测 
    onCollisionEnter(other, self) {
        if (other.node.name == "Brother" && !this.isContact) {
            this.isContact = true;
            let sprite = this.node.getComponent(cc.Sprite);
            if (sprite.enabled) {
                this.currScene.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.RESTART);
            }
        }

    }

}

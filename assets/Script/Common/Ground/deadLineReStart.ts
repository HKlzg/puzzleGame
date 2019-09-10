
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";
import settingBasic from "../../Setting/settingBasic";
@ccclass
export default class DeadLineBasic extends LogicBasicComponent {

    // onLoad () {}
    currScene: cc.Node = null;
    isContact: boolean = false;

    onLoad() {
        this.currScene = cc.find("Canvas/" + settingBasic.game.currScene);
    }
    start() {
    }

    logicUpdate(dt) {
        this.isContact = settingBasic.game.State == settingBasic.setting.stateType.REBORN;
    }
    onCollisionEnter(other, self) {
        
        // 和人物碰撞 
        if (other.node.groupIndex == 6 && !this.isContact) {
            this.isContact = true;
            this.currScene.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.RESTART);
        }
    }


}

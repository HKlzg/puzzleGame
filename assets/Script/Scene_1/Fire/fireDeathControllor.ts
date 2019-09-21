
const {ccclass, property} = cc._decorator;
import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
@ccclass
export default class NewClass extends LogicBasicComponent {

    currScene: cc.Node = null;


    start () {
        this.currScene = cc.find("Canvas/" + settingBasic.game.currScene);
    }
    
    logicUpdate(dt){
        
    }

    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 6){
            this.currScene.emit(settingBasic.gameEvent.gameStateEvent,settingBasic.setting.stateType.RESTART);
        }
    }

    // update (dt) {}
}

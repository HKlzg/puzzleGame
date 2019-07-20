import { RopeConnectBasic } from "../../Common/Rope/ropeConnectBasic"
import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends RopeConnectBasic {
 
    canvasNode:cc.Node=null;
    start() {
        this.canvasNode = cc.find("Canvas");
    }

    ropeOnBeginContact(contact,ropeCollider,otherCollider) {
        
        if(otherCollider.node.groupIndex == 2){ //2 - arrow
            this.canvasNode.emit(settingBasic.gameEvent.gameStepEvent , "2");
        }

    }
}

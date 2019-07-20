import { RopeConnectBasic } from "../../Common/Rope/ropeConnectBasic"
import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends RopeConnectBasic {
 
    isTouched: boolean = false;
    canvasNode: cc.Node = null;
    start() {
        this.canvasNode = cc.find("Canvas")
    }

    ropeOnBeginContact(contact, ropeCollider, otherCollider) {
        if (!this.isTouched && otherCollider.node.groupIndex == 2) {
        
        }
    }


}

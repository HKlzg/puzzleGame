const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";
@ccclass
export default class NewClass extends cc.Component {

    canvasNode: cc.Node = null;
    start() {
        this.canvasNode = cc.find("Canvas")
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        // console.log("=====Setp onBeginContact=== step1Pos")

        switch (this.node.name) {
            //若到达了 step1Pos ,下一步
            case "step1Pos":
                this.canvasNode.emit(settingBasic.gameEvent.gameMoveStep, 4);
                break;
 
            default:
                break;
        }



    }
}

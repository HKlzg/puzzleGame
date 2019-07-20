
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";
@ccclass
export default class NewClass extends cc.Component {

    canvasNode: cc.Node = null;
    start() {
        this.canvasNode = cc.find("Canvas")
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        // console.log("=====Setp onBeginContact=== step2Pos")

        //this.node = 当前人物所在的位置 
        switch (this.node.name) {
            //若到达了 step1Pos 下面的梯子 ,则继续移动下一步
            // case "step1Pos":
            //     this.canvasNode.emit(settingBasic.gameEvent.gameMoveStep, 2);
            //     break;
            // case "step2Pos":
            //     this.canvasNode.emit(settingBasic.gameEvent.gameMoveStep, 3)
            //     break;

            default:
                break;
        }



    }
}

import { RopeConnectBasic } from "../../Common/Rope/ropeConnectBasic"
import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends RopeConnectBasic {
    // @property(cc.Node)
    // sensorNode: cc.Node = null;

    isTouched: boolean = false;
    isCatched: boolean = false;
    canvasNode: cc.Node = null;
    start() {
        this.canvasNode = cc.find("Canvas")
    }

    ropeOnBeginContact(contact, ropeCollider, otherCollider) {
        // //断掉 碰到传感器之后
        // if (!this.isTouched && otherCollider.node.name == "Sensor_1") {
        //     this.canvasNode.emit(settingBasic.gameEvent.gameStepEvent, "3");
        //     this.isTouched = true;
        //     // this.canvasNode.emit(settingBasic.gameEvent.gameStepEvent, "3");
        // }

        // //人抓住绳子之后
        // if (!this.isCatched && otherCollider.node.groupIndex == 6) {
        //     this.canvasNode.emit(settingBasic.gameEvent.gameStepEvent, "3");
        //     this.isCatched = false;
        // }

    }


}

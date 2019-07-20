import settingBasic from "../../Setting/settingBasic";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    isMove: boolean = false;
    tmpHeight: number = 50;

    canvasNode :cc.Node = null;
    start() {
        this.canvasNode = cc.find("Canvas") ;
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "Stone") {
            this.isMove = true;

        }
    }

    update() {
        if (this.isMove && this.tmpHeight-- > 0) {
            this.node.y--
            this.canvasNode.emit(settingBasic.gameEvent.gameStepEvent, "1");
        }
    }
}

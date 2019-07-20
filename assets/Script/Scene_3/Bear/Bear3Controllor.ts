
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    isWalk: boolean = false;
    isTouched: boolean = false;
    distance: number = 230;
    canvas: cc.Node = null;
    start() {
        this.node.on(setting.gameEvent.bearActionEvent, this.walkEvent, this);
        this.canvas = cc.find("Canvas");
    }
    onBeginContact(contact, selfCollider, otherCollider) {
        if (!this.isTouched && otherCollider.node.groupIndex == 8) {

            this.canvas.emit(setting.gameEvent.gameStepEvent, "4");
            this.isTouched = false;
        }

    }
    update(dt) {
        if (this.isWalk && this.distance > 0) {
            this.node.x += 1;
            this.distance--;
        } else {
            this.isWalk = false;
        }
    }
    walkEvent(action: string) {
        switch (action) {
            case "SLEEP":

                break;
            case "WALK":
                this.isWalk = true;
                break;
            case "STAND":

                break;
            case "SMELL":

                break;
            default:
                break;
        }
    }

}

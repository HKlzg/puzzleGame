import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ground extends cc.Component {

    private canvasNode = null;
    onLoad() {
        this.canvasNode = cc.find("Canvas")
    }

    onBeginContact(contact, selfCollider, otherCollider) {

        if (settingBasic.game.State == settingBasic.setting.stateType.OVER) {
            return;
        } else {
            switch (otherCollider.node.groupIndex) {
                case 2://箭
                    let parent = otherCollider.node.parent;
                    parent != null ? parent.removeChild(otherCollider.node) : null;
                    break;
                // case "PERSON":
                //     //游戏 结束
                //     this.canvasNode.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.OVER);
                //     break;
                default:
                    break;
            }
        }

    }
}

import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;
const itemID = settingBasic.setting.item.id;
const items = settingBasic.setting.item.data;

//scene1 map
@ccclass
export default class NewClass extends LogicBasicComponent {

    @property({ type: cc.Enum(itemID), displayName: "物品ID" })
    itemID: number = 0;

    cameraNode: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:
    currScene: cc.Node = null;
    clickCount: number = 0;
    itemsNode: cc.Node = null;
    isTouch: Boolean = false;
    actionMask: cc.Node = null;
    onLoad() {
    }
    start() {

    }

    logicUpdate(dt) {

    }

    onCollisionEnter(other, self) {
        if (other.node.name == "Brother") {

            this.currScene = cc.find("Canvas/" + settingBasic.game.currScene);
            this.cameraNode = this.currScene.getChildByName("Camera");

            let scale = this.node.scale * this.node.parent.scale;
            let pos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO)
            this.node.parent = this.cameraNode;
            this.node.position = this.cameraNode.convertToNodeSpaceAR(pos);
            this.node.scale = scale;
            this.node.groupIndex = 21; //UI

            cc.tween(this.node).to(0.5, { position: cc.v2(0, 0), angle: 0, scale: 1 }, { easing: "sineIn" }).call(() => {
                // this.currScene.emit(settingBasic.gameEvent.gameMoveStep, 2)
                let tips = this.node.getChildByName("tips");
                if (tips) {
                    tips.active = true; //显示描述
                    tips.setContentSize(this.node.getContentSize());
                    tips.y += (this.node.height * this.node.scaleY) / 2;
                }
                this.isTouch = true;
            }).start();
        }
    }

    onClick() {
        if (!this.isTouch) return;

        cc.tween(this.node).to(0.5, { position: cc.v2(288.39, 545.794), scale: 0.01 }, { easing: "sineIn" }).call(() => {
            this.itemsNode = cc.find("UIMask/UICamera/bookNode/content/items");

            let item = settingBasic.fun.getItemByID(this.itemID)
            item.isShow = true;
            this.itemsNode.getComponent("itemsMarkControllor").additem(item);

            this.node.destroy()
        }).start()

    }
}

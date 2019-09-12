import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
const itemType = settingBasic.setting.itemType; //和等级一致
//scene1 map
@ccclass
export default class NewClass extends cc.Component {
    @property({ type: cc.Enum(itemType), displayName: "物品类别" })
    currItemType: Number = 0;

    cameraNode: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:
    currScene: cc.Node = null;
    clickCount: number = 0;
    itemsNode: cc.Node = null;
    onLoad() {
    }
    start() {
        
    }

    // update (dt) {}

    onClick(e) {
        if (this.clickCount == 0) {
            this.currScene = cc.find("Canvas/" + settingBasic.game.currScene);
            this.cameraNode = this.currScene.getChildByName("Camera");

            let scale = this.node.scale * this.node.parent.scale;
            let pos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO)
            this.node.parent = this.cameraNode;
            this.node.position = this.cameraNode.convertToNodeSpaceAR(pos);
            this.node.scale = scale;
            this.node.groupIndex = 21; //UI

            cc.tween(this.node).to(0.5, { position: cc.v2(0, 0), angle: 0, scale: 1 }, { easing: "sineIn" }).call(() => {
                this.currScene.emit(settingBasic.gameEvent.gameMoveStep, 2)
            }).start();
            this.clickCount++;
        } else if (this.clickCount == 1) {
            cc.tween(this.node).to(0.5, { position: cc.v2(288.39, 545.794), scale: 0.01 }, { easing: "sineIn" }).call(() => {
                this.itemsNode = cc.find("UIMask/UICamera/bookNode/content/items");
                this.itemsNode.getComponent("itemsMarkControllor").getitem(this.currItemType);

                this.node.destroy()
            }).start()

            this.clickCount++;
        }
    }
}

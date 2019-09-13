import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
const itemType = settingBasic.setting.itemType;
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
        if (this.clickCount == 0) { //显示在屏幕中间
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
            }).start();
            this.clickCount++;
        } else if (this.clickCount == 1) { //放入道具背包
            cc.tween(this.node).to(0.5, { position: cc.v2(288.39, 545.794), scale: 0.01 }, { easing: "sineIn" }).call(() => {
                this.itemsNode = cc.find("UIMask/UICamera/bookNode/content/items");
                this.itemsNode.getComponent("itemsMarkControllor").getitem(this.currItemType);

                //当获得的是map 道具时(0-3)则表示次关卡已通关 自动跳到book页面
                if(this.currItemType<=3){
                    this.currScene.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.NEXT)
                }

                this.node.destroy()
            }).start()

            this.clickCount++;
        }
    }
}

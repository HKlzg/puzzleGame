
const { ccclass, property } = cc._decorator;
import AchieveManager from "../Achievement/achievementControllor";
/**
 * 用于显示在UIcamera 的成就提示
 */
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    achieveNode: cc.Node = null;
    achieveManager = AchieveManager.getAchieveManager();
    // onLoad () {}

    start() {
        this.achieveNode.active = false;
        this.achieveManager.setAchieveTipNode(this);
    }

    showAchievement(name: string) {
        this.achieveNode.active = true;
        let desc = this.achieveNode.getChildByName("name");
        desc.getComponent(cc.Label).string = "获得成就: " + name;
        this.achieveNode.scale = 0.5
        this.achieveNode.opacity = 100
        cc.tween(this.achieveNode).to(0.4, { scale: 1, opacity: 255 }, { easing: "sineInOut" })
            .delay(1.5).then(cc.fadeOut(0.5))
            .start()
    }
    // update (dt) {}


}

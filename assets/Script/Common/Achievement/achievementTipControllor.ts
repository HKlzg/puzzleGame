
const { ccclass, property } = cc._decorator;
import AchieveManager from "../Achievement/achievementControllor";
class achievement { //每个成就的详细信息
    type: number;
    name: string;
    desc: string;
    isGet: boolean;
    count: number;
    needNum: number;
    constructor({ type, name, desc, isGet, count, needNum }) {
        this.type = type;
        this.name = name;
        this.desc = desc;
        this.isGet = isGet;
        this.count = count;
        this.needNum = needNum;
    }
}
/**
 * 用于显示在UIcamera 的成就提示
 */
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    achieveNode: cc.Node = null;
    achieveManager = AchieveManager.getAchieveManager();
    // onLoad () {}
    isShowing = false;
    newAchieveList: achievement[] = [];

    achieveCtrl: any = null;
    start() {
        this.achieveNode.active = false;
        this.achieveCtrl = cc.find("UIMask/UICamera/bookNode/content/achievement").getComponent("achieveMarkControllor");
    }

    showAchievement(name: string) {
        if (this.isShowing) return;
        this.isShowing = true;
        this.achieveNode.active = true;
        let desc = this.achieveNode.getChildByName("name");
        desc.getComponent(cc.Label).string = "获得成就: " + name;
        this.achieveNode.scale = 0.5
        this.achieveNode.opacity = 100
        cc.tween(this.achieveNode).to(0.4, { scale: 1, opacity: 255 }, { easing: "sineInOut" })
            .delay(1.5).then(cc.fadeOut(0.5))
            .call(() => {
                this.isShowing = false;
            })
            .start()
    }
    update(dt) {
        let newList = this.achieveManager.getNewAchieve();
        if (newList.length > 0) {
            this.newAchieveList = newList;
            this.newAchieveList.forEach(e => {
                if(e.isGet){
                    this.showAchievement(e.name);
                }
                this.achieveCtrl.refrush([e]);
            })
        }
    }
    onEnable() {
        this.achieveNode.resumeAllActions();
    }
    onDisable() {
        this.achieveNode.stopAllActions();
    }

}

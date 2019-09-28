import settingBasic from "../../Setting/settingBasic";
import AchievementControllor from "../Achievement/achievementControllor";
import { gameRecordClass } from "../BasicClass/recordClass";

const { ccclass, property } = cc._decorator;
const type = cc.Enum({
    In: 1,
    Out: 2
})
//进入下一关的通道
@ccclass
export default class NewClass extends cc.Component {

    @property({ type: type })
    outOrIn = type.In;

    isContact: boolean = false;
    // onLoad () {}
    collider: cc.BoxCollider = null;
    isCanTouch: boolean = false; //在切换场景之后 是否能碰撞
    canvasCtrl: any = null;
    start() {
        this.canvasCtrl = cc.find("Canvas").getComponent("CanvasControllor");
    }
    onEnable() {
        cc.tween(this.node).delay(3).call(() => {
            this.isCanTouch = true;
        }).start();


    }
    onDisable() {
        this.isCanTouch = false;
        this.isContact = false;
    }
    // update (dt) {}

    onCollisionEnter(other, self) {
        if (!this.isContact && other.node.groupIndex == 6 && this.isCanTouch) {
            let canvas = cc.find("Canvas").getComponent("CanvasControllor");
            this.isContact = true;
            if (this.outOrIn == type.Out) {
                canvas.loadNextScene();

                let lv = settingBasic.game.currLevel;
                if (lv == 4) {
                    //lv-4 成就 -一蹴而就
                    AchievementControllor.getAchieveManager().addRecord(settingBasic.setting.achievements.Overnight)
                }
                let record: gameRecordClass = this.canvasCtrl.getGameRecords();
                record.levelRecord["lv" + lv] = true;
                console.log("=====第"+lv+"关卡 通过=====")
                this.canvasCtrl.saveRecords(settingBasic.setting.storageKey.game, record);
            } else {
                canvas.loadLastScene();
            }
        }
    }
}

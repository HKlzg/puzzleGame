
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";
import settingBasic from "../../Setting/settingBasic";
import AchievementControllor from "../Achievement/achievementControllor";
@ccclass
export default class DeadLineBasic extends LogicBasicComponent {

    // onLoad () {}
    currScene: cc.Node = null;
    isContact: boolean = false;
    achieveManager = AchievementControllor.getAchieveManager();
    onLoad() {
        this.currScene = cc.find("Canvas/" + settingBasic.game.currScene);
    }
    start() {
    }

    logicUpdate(dt) {
        this.isContact = settingBasic.game.State == settingBasic.setting.stateType.REBORN;
    }
    onCollisionEnter(other, self) {

        // 和人物碰撞 
        if (other.node.groupIndex == 6 && !this.isContact) {
            this.isContact = true;
            let currLv = settingBasic.game.currLevel;
            let achieveTypes = settingBasic.setting.achievements;
            switch (currLv) {
                case 2:
                    //第二关 掉进水中 死亡-> 成就:我是水鬼
                    this.achieveManager.addRecord(2, achieveTypes.lv2.IAmWaterGhost);
                    break;

                default:
                    break;
            }

            this.currScene.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.RESTART);
        }
    }


}

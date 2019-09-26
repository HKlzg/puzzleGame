import { ViewControllorBasic } from "../Common/viewControllorBasic";
import audioSetting from "../Common/Audio/audioSetting";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends ViewControllorBasic {
    fires: {} = {};
    fireNum: number = 0;
    toStart() {
        this.audioManager.playAudio(audioSetting.other.lv1.river, true)

        //成就时间 5min
        this.scheduleOnce(() => {
            this.achieveManager.addRecord(this.level, this.achieveTypes.TimeCollector)
        }, 300)
    }
    loadSubPackage() {

    }
    //设置游戏通关步骤
    gameStep(setp) {

    }
    moveStep(setp) {
        if (!this.fires["" + setp]) {
            this.fires["" + setp] = setp;
            this.fireNum++;
        }
        //当所有火被浇灭之后 过关
        if (this.fireNum == 4) {
        }
    }

    toUpdate() {

    }


}

import { ViewControllorBasic } from "../Common/viewControllorBasic";
import settingBasic from "../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends ViewControllorBasic {

    fires: {} = {};
    fireNum: number = 0;
    start() {
        this.toolsBasics.getAudioManager().playLoopBGM("river");

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
        // console.log("=============setp="+ JSON.stringify(this.fires)+"    ===this.fireNum= "+this.fireNum)
        //当所有火被浇灭之后 过关
        if (this.fireNum == 4) {
            this.changeGameState(settingBasic.setting.stateType.NEXT);
        }
    }

    toUpdate() {

    }

}

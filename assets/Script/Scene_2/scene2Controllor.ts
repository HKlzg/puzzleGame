import { ViewControllorBasic } from "../Common/viewControllorBasic";
import settingBasic from "../Setting/settingBasic";
import tools from "../Tools/toolsBasics";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends ViewControllorBasic {
    audioManager = tools.getAudioManager();

    start() {
        this.audioManager.playLoopBGM("river");

    }
    //重写
    loadSubPackage() {

    }
    //重写 开启 游戏机关 的步骤
    gameStep(step: string) {
        //防止一直触发相同 步骤
        if (step == this.stepList[this.stepList.length - 1]) return;
        this.stepList.push(step);

        switch (step) {

            case "0":
                break;
            default:
                break;
        }
    }
    // 重写 设置brother移动步骤
    moveStep(nextStep) {

        // console.log("=========nextStep=" + nextStep);
        let order: { direction: string, action: string } = { direction: "R", action: "WAIT" };

        switch (nextStep) {
            case 0://等待
                order = { direction: "R", action: "WAIT" };
                break;
            case 1: //向右走
                order = { direction: "R", action: "WALK" };

                break;
            case 2://向上爬
                //先检测是否开启了下面梯子的机关
                // console.log("=======moveStep=========" + nextStep + "  " + this.isContainsStep("1") + "  len=" + this.stepList.length)
                if (this.isContainsStep("1") && this.isContainsStep("2")) {
                    order = { direction: "U", action: "CLIMB" };
                }
                break;
            case 3://向右走
                order = { direction: "R", action: "WALK" };
                break;
            default:
                break;
        }
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
        //记录当前开启的机关步骤
        //this.setCurrGameStep(nextStep);

    }
    //重写
    toUpdate() {

    }





}

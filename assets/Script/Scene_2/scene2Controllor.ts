import { ViewControllorBasic } from "../Common/viewControllorBasic";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends ViewControllorBasic {

    toStart() {

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

    }
    //重写
    toUpdate() {

    }





}

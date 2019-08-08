import { ViewControllorBasic } from "../Common/viewControllorBasic";
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends ViewControllorBasic {

    toStart() {
        this.audioManager.playLoopBGM("night");
    }
    loadSubPackage() {

    }
    //开启 游戏机关 的步骤
    gameStep(step: string) {

    }
    //设置brother移动步骤
    moveStep(nextStep) {

    }

    toUpdate() { }

}

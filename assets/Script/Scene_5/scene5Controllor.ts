import { ViewControllorBasic } from "../Common/viewControllorBasic";
import settingBasic from "../Setting/settingBasic";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends ViewControllorBasic {
    canvas: cc.Node = null;
 
    toStart() {
       
    }
    loadSubPackage() {

    }
    //开启 游戏机关 的步骤
    gameStep(step: string) {
       ;

    }
    //设置brother移动步骤
    moveStep(nextStep) {

     
    }

    toUpdate(){}
}

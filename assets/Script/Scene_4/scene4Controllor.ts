import { ViewControllorBasic } from "../Common/viewControllorBasic";
import settingBasic from "../Setting/settingBasic";
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends ViewControllorBasic {
    containerNode: cc.Node = null;
    brotherNode: cc.Node = null;
 
    toStart() {
        this.containerNode = this.node.getChildByName("Container");
        this.brotherNode = this.containerNode.getChildByName("Brother")
          //默认开启第一步
        this.gameStep("1");

        // this.gameStep("3");
        // this.moveStep();
    }
    loadSubPackage() {

    }
    //开启 游戏机关 的步骤
    gameStep(step: string) {
        //防止一直触发相同 步骤
        if (step == this.stepList[this.stepList.length - 1]) return;

        switch (step) {

            case "0": //等待
                this.moveStep(0);
                break;
            case "1":
              
                break;
            case "2":
               
                break;
            case "3":
             
                break;

            case "4":
                //石头落下
                this.moveStep(3);
                break;

            default:
                break;
        }
        this.stepList.push(step);

    }
    //设置brother移动步骤
    moveStep(nextStep) {

        // console.log("=========nextStep="+nextStep);
        let order: { direction: string, action: string } = { direction: "R", action: "WAIT" };

        switch (nextStep) {
            case 0://等待
                order = { direction: "R", action: "WAIT" };
                break;
            case 1: //向右走
                order = { direction: "R", action: "WALK" };

                break;
            case 2://拉绳子

                if (this.isContainsStep("2")) {
                    order = { direction: "U", action: "CLIMB" };

                } else {
                    order = { direction: "L", action: "WAIT" };
                }
                // console.log("=========拉绳子="+JSON.stringify(order));

                break;
            case 3://向右走
                order = { direction: "R", action: "WALK" };
                break;
            default:
                break;
        }
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)


    }

    toUpdate(){}
}

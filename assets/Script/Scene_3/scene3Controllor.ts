import { ViewControllorBasic } from "../Common/viewControllorBasic";
import settingBasic from "../Setting/settingBasic";
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends ViewControllorBasic {
    containerNode: cc.Node = null;
    brotherNode: cc.Node = null;
    bearNode: cc.Node = null;
    bearAnimation: cc.Animation = null;
    bigStone: cc.Node = null;

    start() {
        this.containerNode = this.node.getChildByName("Container");
        this.brotherNode = this.containerNode.getChildByName("Brother");
        this.bearNode = this.node.getChildByName("Bear");
        this.bearAnimation = this.bearNode.getComponent(cc.Animation);
        this.bigStone = this.containerNode.getChildByName("BigStone");

        this.gameStep("01");
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
                this.bearAnimation.play("SleepClip");
                // this.moveStep(0);
                break;
            case "1":
                //
                // this.bearAnimation.setCurrentTime(2)
                this.bearAnimation.play("SmellClip");
                this.bearAnimation.scheduleOnce(() => {
                    this.gameStep("2");
                }, 1.5)

                // this.moveStep(1);
                break;
            case "2":
                this.bearAnimation.play("WalkClip");
                this.bearNode.emit(settingBasic.gameEvent.bearActionEvent, "WALK")
                this.bearAnimation.scheduleOnce(() => {
                    this.gameStep("3");
                }, 4)
                // this.moveStep(2);
                break;
            case "3":
                console.log("====bearAnimation===StandUpClip====")
                this.bearAnimation.play("StandUpClip");

                break;

            case "4":
                //石头右滚动
                let stoneBody = this.bigStone.getComponent(cc.RigidBody);
                // console.log("=======石头右滚动====")
                stoneBody.angularVelocity = 20;
                break;
            case "5":
                //人右走
                this.moveStep(1)
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
            case 2:// 

                // if (this.isContainsStep("2")) {
                //     order = { direction: "U", action: "CLIMB" };

                // } else {
                //     order = { direction: "L", action: "WAIT" };
                // }
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

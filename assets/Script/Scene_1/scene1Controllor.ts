import { ViewControllorBasic } from "../Common/viewControllorBasic";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends ViewControllorBasic {
    fires: {} = {};
    fireNum: number = 0;
    toStart() {
        //不能直接在start 中emit 信息 ,原因:对应的node 可能还没创建
        this.audioManager.playLoopBGM("river");
        //每个关卡 单独设置人物动作的声音
        let msg: [{ actionType: number, name: string }] = [{ actionType: 0, name: "" }];
        msg.push({ actionType: this.actionType.Walk, name: "null" });
        msg.push({ actionType: this.actionType.Jump, name: "walkInRiver" });
        this.setPersonAudioName(msg);

        //成就时间 10min
        this.scheduleOnce(() => {
            this.achieveManager.addRecord(this.level, this.achieveTypes.lv1.TimeCollector)
        }, 600)
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
            // this.changeGameState(this.settingBasic.setting.stateType.NEXT);

            //test:
            // this.cameraNode.getChildByName("test").getComponent(cc.Label).string = "已通关，谢谢体验";
            this.achieveManager.addRecord(this.level, this.achieveTypes.lv1.SadnessMessenger)
        }
    }

    toUpdate() {

    }


}

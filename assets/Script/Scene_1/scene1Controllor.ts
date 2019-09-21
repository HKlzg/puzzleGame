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
        msg.push({ actionType: this.actionType.Walk, name: "jumpOnFloor" });
        msg.push({ actionType: this.actionType.Jump, name: "jumpOnFloor" });
        this.setPersonAudioName(msg);

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

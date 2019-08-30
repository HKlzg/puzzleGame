
const { ccclass, property } = cc._decorator;
import tools from "../../Tools/toolsBasics";
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
const monsterActionType = cc.Enum({
    sleep: 0,
    standOrLieDown: 1, //过度 
    walk: 2,
    warning: 3, //警戒
    attack: 4  //攻击
})
@ccclass
export default class NewClass extends LogicBasicComponent {

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    isJump: boolean = false;

    audioManager = tools.getAudioManager();
    start() {

    }

    logicUpdate (dt) {}

    jumpStart() {
        if (this.isJump) return
        this.isJump = true;

    }
    jumpEnd() { //attack End
        this.isJump = false;
        let parent = this.node.parent;
        parent.emit(setting.gameEvent.monsterStopPlayAction,false)
    }

    standUpEnd() {
        let parent = this.node.parent;
        parent.emit(setting.gameEvent.monsterStopPlayAction,false)
    }
    lieDownEnd() {
        let parent = this.node.parent;
        parent.emit(setting.gameEvent.monsterStopPlayAction,false)
    }

}

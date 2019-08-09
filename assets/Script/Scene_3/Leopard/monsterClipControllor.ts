
const { ccclass, property } = cc._decorator;
import tools from "../../Tools/toolsBasics"

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    isJump: boolean = false;

    audioManager = tools.getAudioManager();
    start() {

    }

    // update (dt) {}

    jumpStart() {
        if (this.isJump) return
        this.isJump = true;

    }
    jumpEnd() {
        this.isJump = false;

    }

}

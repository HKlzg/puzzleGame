import audioControllor from "../../Common/Audio/audioControllor";
import audioSetting from "../../Common/Audio/audioSetting";

const { ccclass, property } = cc._decorator;
//仅仅用于石头碰撞到地面后播放声音
@ccclass
export default class NewClass extends cc.Component {


    audioSource: audioControllor = null;
    start() {
        this.audioSource = cc.find("UICamera/audio").getComponent("audioControllor");

    }

    // update (dt) {}
    onBeginContact(contact, self, other) {
        if (other.node.groupIndex == 4) {
            this.audioSource.playAudio(audioSetting.other.lv5.stone);
        }
    }
}

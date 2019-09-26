
import audioControllor from "../../Common/Audio/audioControllor";
import audioSetting from "../../Common/Audio/audioSetting";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    audioSource: audioControllor = null;
    fallAudioID = -1;

    start() {
        this.audioSource = cc.find("UICamera/audio").getComponent("audioControllor");
    }

    onCollisionEnter(other, self) {
        if (other.node.name == "Brother" || other.node.groupIndex == 12) {

            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(100, 0);
            this.node.getComponent(cc.PhysicsPolygonCollider).apply();
            //播放倒下音效 非持续
            this.fallAudioID = this.audioSource.playAudio(audioSetting.other.lv4.stoneStepFallDown);

        }
    }
    // update (dt) {}

    onBeginContact(contact, self, other) {
        if (other.node.groupIndex == 12) { //石头
            this.audioSource.stopAudioById(this.fallAudioID)
            this.audioSource.playAudio(audioSetting.other.lv4.stone.crash.onStone);
        }
    }
}

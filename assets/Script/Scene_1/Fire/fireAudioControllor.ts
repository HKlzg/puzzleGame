import audioSetting from "../../Common/Audio/audioSetting";
import audioControllor from "../../Common/Audio/audioControllor";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Float)
    maxVolume: number = 0.5;
    @property(cc.Float)
    minVolume: number = 0.05;

    audioSource: audioControllor = null;
    id: number = 0;
    // onLoad () {}
    start() {

        this.audioSource = cc.find("UICamera/audio").getComponent("audioControllor");
        let fireName = audioSetting.other.lv1.fire.burning;
        this.id = this.audioSource.playAudio(fireName, true, this.maxVolume, this.minVolume, this.node, true);

    }
    onDisable() {
        this.audioSource.stopAudioById(this.id);
    }

    // update (dt) {}
}

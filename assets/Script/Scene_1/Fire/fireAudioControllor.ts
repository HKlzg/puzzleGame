
import tools from "../../Tools/toolsBasics";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Float)
    maxVolume: number = 0.5;
    @property(cc.Float)
    minVolume: number = 0.05;

    audioSource: any = null;
    id: number = 0;
    // onLoad () {}
    start() {
        this.audioSource = cc.find("UICamera/audio").getComponent("audioControllor");

        this.id = this.audioSource.playAudio("fire", true, this.maxVolume, this.minVolume, this.node, true);

    }
    onDisable() {
        this.audioSource.stopAudioById(this.id);
    }

    // update (dt) {}
}

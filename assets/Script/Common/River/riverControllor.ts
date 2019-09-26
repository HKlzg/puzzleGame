import toolsBasics from "../../Tools/toolsBasics";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";
import audioSetting from "../Audio/audioSetting";
import audioControllor from "../../Common/Audio/audioControllor";
const { ccclass, property } = cc._decorator;
const audioType = cc.Enum({
    none: 0,
    river: 1,
    waterfall: 2,
})
@ccclass
export default class River extends LogicBasicComponent {

    @property(cc.Node)
    river: cc.Node = null;
    @property(cc.Float)
    far_speed = -5;
    @property({ type: audioType })
    audioType = audioType.none;

    audioSource: audioControllor = null;
    long: number = 0;
    onLoad() {
        this.audioSource = cc.find("UICamera/audio").getComponent("audioControllor");

        let audioName = "";
        if (this.audioType == audioType.river) {
            audioName = audioSetting.other.lv1.river;
            this.audioSource.playAudio(audioName, true, 0.6, 0.6);
        } else if (this.audioType == audioType.waterfall) {
            audioName = audioSetting.other.lv2.waterfall;
            this.audioSource.playAudio(audioName, true, 0.6, 0.05, this.node, true);
        }

    }

    logicUpdate(dt) {
        toolsBasics.playLoopFlow(this.river, this.far_speed);
    }


}
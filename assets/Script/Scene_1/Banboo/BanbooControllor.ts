import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import settingBasic from "../../Setting/settingBasic";
import audioSetting from "../../Common/Audio/audioSetting";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Node)
    targetBanboo: cc.Node = null;

    @property(cc.Node)
    preWater: cc.Node = null;

    @property(cc.Node)
    targetWater: cc.Node = null;

    @property(cc.Node)
    fire: cc.Node = null;

    @property(cc.Float)
    minAngle: number = 0;
    @property(cc.Float)
    maxAngle: number = 0;
    @property(cc.Float)
    minHeight: number = 0;

    mask1InitHeight: number = 0;
    mask2InitHeight: number = 0;
    time: number = 1.1;
    isAudioPlaying: boolean = false;

    audio: any = null;
    currScene: cc.Node = null;

    waterStreamID = 0; //水流音效ID
    onLoad() {
        this.audio = cc.find("UICamera/audio").getComponent("audioControllor");
        this.mask1InitHeight = this.maskNode.height;
        this.currScene = cc.find("Canvas/" + settingBasic.game.currScene);
    }

    onEnable() {
        this.node.parent.getComponent(cc.WheelJoint).apply();
    }
    start() {
        this.targetWater.active = false;
    }

    logicUpdate(dt) {
        this.targetWaterMaskContrl();
        if (this.isAudioPlaying) {
            if (this.time < 1) {
                this.time += 0.1;
            } else {
                this.isAudioPlaying = false;
            }
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.groupIndex == 2 && this.time > 1) {
            let boxCtrl = otherCollider.node.getComponent("BoxInstanceControllor");
            let isInstance = boxCtrl.getIsInstance();
            if (isInstance) {
                this.time = 0;
                this.isAudioPlaying = true;
                let id = this.audio.playAudio(audioSetting.box.crash.onBanboo);
            }
        }
    }

    //水流 遮罩控制
    targetWaterMaskContrl() {

        let banbooAngle = this.targetBanboo.angle;
        banbooAngle = banbooAngle % 360 > 0 ? banbooAngle % 360 : banbooAngle;
        if (banbooAngle >= this.minAngle && banbooAngle <= this.maxAngle) {

            let tempAngle = this.maxAngle - this.minAngle;
            let height = this.mask1InitHeight - (this.maxAngle - banbooAngle) / tempAngle * (this.mask1InitHeight - this.minHeight)
            this.maskNode.height = height >= this.minHeight ? height : this.minHeight;
            if (banbooAngle <= 0 && this.preWater.active) {
                cc.tween(this.node).delay(1).call(() => {
                    this.targetWaterStream();
                }).start();
            }
            else {
                this.targetWater.active = false;
                this.audio.stopAudioById(this.waterStreamID);
            }
        } else {
            this.maskNode.height = this.mask1InitHeight;
            this.targetWater.active = false;
            this.audio.stopAudioById(this.waterStreamID);

        }

    }
    targetWaterStream() {
        this.targetWater.active = true;
        // 水流音效
        let waterStream = audioSetting.other.lv1.waterStream;
        this.waterStreamID = this.audio.playAudio(waterStream, true, 0.5, 0.01, this.targetWater, true);

        //持续浇水2S 火才能熄灭
        cc.tween(this.node).delay(2).call(() => {
            //2S之后检测水是否处于开启状态
            if (this.targetWater.active) {
                if (this.fire.active) {
                    //火熄灭 音效
                    let fireQuench = audioSetting.other.lv1.fire.burning;
                    let fireQuench_ID = this.audio.playAudio(fireQuench, true, 0.5, 0.01, this.fire, true);

                    cc.tween(this.fire).then(cc.fadeOut(2)).call(() => {
                        this.audio.stopAudioById(fireQuench_ID);
                        this.fire.active = false;
                        this.currScene.emit(settingBasic.gameEvent.gameMoveStep, 1)
                    }).start();
                }
            }
        }).start();

    }

}

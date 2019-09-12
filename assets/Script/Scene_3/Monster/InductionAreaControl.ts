import toolsBasics from "../../Tools/toolsBasics";
const { ccclass, property } = cc._decorator;
import audio from "../../Common/Audio//audioControllor"
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
const personActionType = setting.setting.actionType;
@ccclass
export default class NewClass extends LogicBasicComponent {

    audioManager: audio = null;
    @property(cc.Animation)
    tigerAni: cc.Animation = null;
    @property(cc.Node)
    monster: cc.Node = null;
    ID = null;
    ID2 = null;
    ID3 = null;
    heartype: number = 0;
    dis = 0;
    isplaying = false;
    index = 1;
    index2 = 1;
    index3 = 1;
    canves = null;
    startpos = null;
    endpos = null;
    @property(cc.Node)
    player: cc.Node = null;
    quiet = false;
    awake = false;
    start() {
        this.audioManager = cc.find("UICamera/audio").getComponent("audioControllor");
        this.canves = cc.find("Canvas");
    }

    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 6 && other.node.name == "Brother") {
            this.getclip();
            if (!this.quiet) {
                this.awake = true;
            } else {
                this.awake = false;
            }
        }
    }

    logicUpdate(dt) {

    }

    onCollisionStay(other, self) {
        this.startpos = this.node.convertToWorldSpace(new cc.Vec2(this.node.width / 2, this.node.height / 2));
        this.endpos = other.node.convertToWorldSpace(new cc.Vec2(other.node.width / 2, other.node.height / 2));
        if (other.node.groupIndex == 6 && other.node.name == "Brother") {
            this.getclip();
            if (!this.quiet) {
                this.awake = true;
            } else {
                this.awake = false;
            }
            if (!this.quiet && this.awake) {
                this.dis = toolsBasics.distanceVector(this.startpos, this.endpos);
                if (this.index == 1 && this.dis < 700 && this.dis > 500) {
                    this.tigerAni.play("StandUpClip");
                    this.ID = this.audioManager.playAudio("heartBeat_1", true);
                    if (this.ID2)
                        this.audioManager.stopAudioById(this.ID2);
                    if (this.ID3)
                        this.audioManager.stopAudioById(this.ID3);
                    this.index = cc.audioEngine.getState(this.ID);
                    this.index2 = 1;
                    this.index3 = 1;
                }
                else if (this.index2 == 1 && this.dis < 500 && this.dis > 300) {
                    this.tigerAni.play("WalkClip");
                    this.ID2 = this.audioManager.playAudio("heartBeat_2", true);
                    if (this.ID)
                        this.audioManager.stopAudioById(this.ID);
                    if (this.ID3)
                        this.audioManager.stopAudioById(this.ID3);
                    this.index2 = cc.audioEngine.getState(this.ID);
                    this.index = 1;
                    this.index3 = 1;

                }
                else if (this.index3 == 1 && this.dis < 300 && this.dis > 100) {
                    this.tigerAni.play("ReadyAttackClip");
                    this.ID3 = this.audioManager.playAudio("heartBeat_3", true);
                    if (this.ID)
                        this.audioManager.stopAudioById(this.ID);
                    if (this.ID2)
                        this.audioManager.stopAudioById(this.ID2);
                    this.index3 = cc.audioEngine.getState(this.ID);
                    this.index = 1;
                    this.index2 = 1;
                }
            } else {
                return;
            }
            if (this.dis < 500 && this.dis > 300 && this.startpos.x - this.endpos.x > 0) {
                this.monster.position.x += 10;
            }
        }
    }

    onCollisionExit(other, self) {
        if (other.node.groupIndex == 6) {
            this.stopAudio();
        }
    }

    stopAudio() {
        this.audioManager.stopAudioById(this.ID);
        this.index = 1;
        this.index2 = 1;
        this.index3 = 1;
    }

    getclip() {
        this.player.emit(setting.gameEvent.getBrotherAction, "", (action) => { //获取的当前人物动作
            if (action == personActionType.QuietlyWalk) {
                this.quiet = true;
            } else {
                this.quiet = false;
            }
        })
    }
}

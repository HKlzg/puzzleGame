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
    index = cc.audioEngine.AudioState.STOPPED;
    index2 = cc.audioEngine.AudioState.STOPPED;
    index3 = cc.audioEngine.AudioState.STOPPED;
    canves = null;
    startpos = null;
    endpos = null;
    @property(cc.Node)
    player: cc.Node = null;
    //安静状态，蹲下走
    quiet = false;
    //醒着
    awake = false;

    isstop = false;

    //老虎没有被关起来
    isclose = false;

    start() {
        this.audioManager = cc.find("UICamera/audio").getComponent("audioControllor");
        this.canves = cc.find("Canvas");
    }

    onCollisionEnter(other, self) {
        if ( other.node.name == "Brother") {
            this.getclip();
            if (!this.quiet && !this.awake) {
                this.awake = true;
            }
        }
    }

    logicUpdate(dt) {

    }

    changeStop(stop){
        this.isstop = stop;
    }

    onCollisionStay(other, self) {
        this.startpos = this.node.convertToWorldSpace(new cc.Vec2(this.node.width / 2, this.node.height / 2));
        this.endpos = other.node.convertToWorldSpace(new cc.Vec2(other.node.width / 2, other.node.height / 2));
        if(!this.isclose){
            if (other.node.name == "Brother" && !this.isclose && !this.isstop) {        
                this.getclip();
                if (!this.quiet && !this.awake) {
                    this.awake = true;
                }
                if (this.awake) {
                    this.tigerAni.getComponent("monsterClipControllor").setIsawake(this.awake);
                    this.dis = toolsBasics.distanceVector(this.startpos, this.endpos);
                    if (this.index == cc.audioEngine.AudioState.STOPPED && this.dis < 700 && this.dis > 500) {
                        console.log("StandUpClip")
                        this.tigerAni.play("StandUpClip");
                        this.audioManager.stopAudioById(this.ID2);
                        this.audioManager.stopAudioById(this.ID3);
                        this.ID = this.audioManager.playAudio("heartBeat_1", true);
                        if(this.ID)
                        this.index = cc.audioEngine.getState(this.ID);
                        if(this.ID2)
                        this.index2 =  cc.audioEngine.getState(this.ID2);
                        if(this.ID3)
                        this.index3 =  cc.audioEngine.getState(this.ID3);
                    }
                    else if (this.index2 == cc.audioEngine.AudioState.STOPPED && this.dis < 500 && this.dis > 300) {
                        this.tigerAni.play("WalkClip");
                        this.audioManager.stopAudioById(this.ID);
                        this.audioManager.stopAudioById(this.ID3);
                        this.ID2 = this.audioManager.playAudio("heartBeat_2", true);
                        if(this.ID2)
                        this.index2 = cc.audioEngine.getState(this.ID2);
                        if(this.ID)
                        this.index = cc.audioEngine.getState(this.ID);
                        if(this.ID3)
                        this.index3 =  cc.audioEngine.getState(this.ID3);
                    }
                    else if (this.index3 == cc.audioEngine.AudioState.STOPPED && this.dis < 300 && this.dis > 0) {
                        this.tigerAni.play("ReadyAttackClip");
                        this.audioManager.stopAudioById(this.ID);
                        this.audioManager.stopAudioById(this.ID2);
                        this.ID3 = this.audioManager.playAudio("heartBeat_3", true);
                        if(this.ID2)
                        this.index2 = cc.audioEngine.getState(this.ID2);
                        if(this.ID)
                        this.index = cc.audioEngine.getState(this.ID)
                        if(this.ID3)
                        this.index3 =  cc.audioEngine.getState(this.ID3);
                    }
                } else {
                    return;
                }
                // if (this.dis < 500 && this.dis > 300 && this.startpos.x - this.endpos.x > 0) {
                //     this.monster.position.x += 10;
                // }
            }
            else if(other.node.name == "Brother" && this.isstop){
                this.tigerAni.stop();
            }
        }else{
            this.tigerAni.play("CatchClip");
        }
      
    }

    
    setIsclose(close){
        this.isclose = close;
    }

    onCollisionExit(other, self) {
        if (other.node.name == "Brother") {
            this.tigerAni.play("LieDownClip");
            this.stopAudio();
            this.awake = false;
            this.tigerAni.getComponent("monsterClipControllor").setIsawake(this.awake);
        }
    }

    stopAudio() {
        this.audioManager.stopAudioById(this.ID);
        this.index =  cc.audioEngine.AudioState.STOPPED;
        this.index2 =  cc.audioEngine.AudioState.STOPPED;
        this.index3 =  cc.audioEngine.AudioState.STOPPED;
        this.ID = null;
        this.ID2 = null;
        this.ID3 = null;
    }

    getclip() {
        this.player.emit(setting.gameEvent.getBrotherAction, "", (action) => { //获取的当前人物动作
            if (action == personActionType.QuietlyWalk||action == personActionType.Wait) {
                this.quiet = true;
            } else {
                this.quiet = false;
            }
        })
    }
}


const { ccclass, property } = cc._decorator;
import tools from "../../Tools/toolsBasics";
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import AchievementControllor from "../../Common/Achievement/achievementControllor";
import settingBasic from "../../Setting/settingBasic";
import audioSetting from "../../Common/Audio/audioSetting";
const personActionType = setting.setting.actionType;

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
    angle = 1;
    pos = null;
    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Node)
    canves = null;
    lable = 0
    @property(cc.Animation)
    playani: cc.Animation = null;
    quiet = false;
    audioManager: any = null;
    currScene = null;
    isawake = false;
    isstop = false;
    move = null;
    close = false;
    start() {
        this.audioManager = cc.find("UICamera/audio").getComponent("audioControllor");
        this.currScene = cc.find("Canvas/" + setting.game.currScene);
    }

    logicUpdate(dt) { }

    jumpStart() {

        this.audioManager.playAudio(audioSetting.other.lv3.tiger.attack)
        this.getclip();
        if (this.lable == 0 && this.isawake) {
            this.anglefif();
            let parent = this.node.parent;
            parent.setSiblingIndex(this.player.parent.getSiblingIndex() - 1);
            parent.scaleX = this.angle;
            let playerpos = this.player.convertToWorldSpace(cc.v2(0, 0));
            playerpos = this.canves.convertToNodeSpace(playerpos);
            let pos = cc.v2(playerpos.x, 13);
            let jump = cc.jumpTo(0.88, pos, parent.position.y + 100, 1);
            parent.runAction(jump);
            this.lable = 1;
        }
    }

    jumpEnd() { //attack End
        this.isJump = false;
        let parent = this.node.parent;
        parent.emit(setting.gameEvent.monsterStopPlayAction, false)
    }
    walkstart() {
        this.getclip();
    }

    changeStop(stop) {
        this.isstop = stop;
        this.node.parent.stopAction(this.move);
    }

    standUpEnd() {
        // let parent = this.node.parent;
        // parent.emit(setting.gameEvent.monsterStopPlayAction, false)
    }
    lieDownEnd() {
        // let parent = this.node.parent;
        // parent.emit(setting.gameEvent.monsterStopPlayAction, false)
    }

    walk() {
        if (this.isawake) {
            this.anglefif();
            let parent = this.node.parent;
            parent.scaleX = this.angle;
            this.move = cc.moveTo(1.33, cc.v2(parent.position.x + 200 * this.angle, parent.position.y));
            parent.runAction(this.move);
        }
    }

    setIsawake(isawake) {
        this.isawake = isawake;
    }

    setIsclose(close) {
        this.close = close;
        this.node.parent.stopAction(this.move);
    }


    anglefif() {
        let playerpos = this.player.convertToWorldSpace(cc.v2(0, 0));
        playerpos = this.canves.convertToNodeSpace(playerpos);
        let parent = this.node.parent;
        if (playerpos.x - parent.x >= 0) {
            this.angle = 1;
        } else {
            this.angle = -1;
        }
    }

    onCollisionEnter(other, self) {
        if (this.isawake && other.node.name == "Brother" && !this.close) {
            AchievementControllor.getAchieveManager().addRecord(settingBasic.setting.achievements.IAmFood)
            this.currScene.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.RESTART);
        }
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

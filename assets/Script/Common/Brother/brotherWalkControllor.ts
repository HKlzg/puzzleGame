
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

class AudioType {
    walkName: string;
    jumpName: string;
    magicName: string;
    ClimbName: string;
}

const actionTags = cc.Enum({
    jump: 100,
    climb: 101,
})

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.Node)
    footNode: cc.Node = null;

    parentGravityScale: number = 10;
    isClimbBox: boolean = false;
    isJump: boolean = false;
    jumpXdist: number = 0;//水平跳跃距离
    audioName: AudioType = new AudioType();

    audioManager: any = null;
    start() {
        this.audioManager = cc.find("UICamera/audio").getComponent("audioControllor");
        this.parentGravityScale = this.node.parent.getComponent(cc.RigidBody).gravityScale;
        this.node.on(settingBasic.gameEvent.brotherJumpEvent, this.setJumpX, this)
        this.node.on(settingBasic.gameEvent.brotherSetAudio, this.setWalkAudioName, this)

        //设置默认值
        this.audioName.walkName = "walkInWater";
        this.audioName.jumpName = "jumpOnFloor";
        this.audioName.ClimbName = "";
        this.audioName.magicName = "";
    }

    //设置对应动作的声音
    setWalkAudioName(msgList: [{ actionType: number, name: string }]) {
        // console.log("=============this.walkAudioName=" + JSON.stringify(msgList))
        if (!msgList || msgList.length <= 0) return

        let type = settingBasic.setting.actionType;
        msgList.forEach((msg) => {
            switch (msg.actionType) {
                case type.Jump:
                    this.audioName.jumpName = msg.name;
                    break;
                case type.Walk:
                    this.audioName.walkName = msg.name;
                    break;
                default:
                    break;
            }
        })

    }

    logicUpdate(dt) { }
    //--------------climbBox------------------暂时取消------------
    climbBoxStart() {
        if (this.isClimbBox) return;

        let parent = this.node.parent;
        let tmpX = parent.scaleX > 0 ? 30 : -30;
        parent.runAction(cc.moveTo(0.16, cc.v2(parent.x + tmpX, parent.y + 80)));

        parent.getComponent(cc.RigidBody).gravityScale = 0;
        parent.getComponent(cc.PhysicsBoxCollider).sensor = true;
        parent.getComponent(cc.PhysicsBoxCollider).apply();
        this.isClimbBox = true;
    }

    climbBoxMid() {
        let parent = this.node.parent;
        let tmpX = parent.scaleX > 0 ? 30 : -30;
        parent.runAction(cc.moveTo(0.32, cc.v2(parent.x + tmpX, parent.y + 50)))
    }

    climbBoxMid2() {
        let parent = this.node.parent;
        let tmpX = parent.scaleX > 0 ? 50 : -50;
        parent.runAction(
            cc.sequence(
                cc.moveTo(0.32, cc.v2(parent.x + tmpX, parent.y)),
                cc.callFunc(() => {
                    parent.getComponent(cc.RigidBody).gravityScale = this.parentGravityScale;
                    parent.getComponent(cc.PhysicsBoxCollider).sensor = false;
                    parent.getComponent(cc.PhysicsBoxCollider).apply();
                    parent.emit(settingBasic.gameEvent.brotherPlayState, false);
                })
            )
        )

    }
    climbBoxEnd() {
        this.node.parent.emit(settingBasic.gameEvent.brotherPlayState, false);

        this.isClimbBox = false;

    }

    //------------------------Jump
    setJumpX(dist) {
        this.jumpXdist = dist ? dist : 0;
    }
    jumpStart() {
        if (this.isJump) return;
        this.footNode.emit(settingBasic.gameEvent.jumpStartEvent, true);

        let parent = this.node.parent;
        this.isJump = true;
        let pos: cc.Vec2 = this.node.parent.position;
        let temp = this.jumpXdist;
        let action1 = cc.jumpTo(0.6, cc.v2(pos.x, pos.y), 200, 1);
        let action2 = cc.moveTo(0.6, cc.v2(pos.x + temp, pos.y))
        parent.runAction(
            cc.spawn(
                action1, action2
            )
        ).setTag(actionTags.jump)
    }
    JumpMid() {

    }

    public jumpEnd() {
        let parent = this.node.parent;
        parent.stopActionByTag(actionTags.jump);
        this.footNode.emit(settingBasic.gameEvent.jumpStartEvent, false);

        parent.emit(settingBasic.gameEvent.brotherPlayState, false);
        this.audioManager.playAudio(this.audioName.jumpName);
        this.isJump = false;
    }
    //死亡动画
    deadStart() {
        let parent = this.node.parent;
        parent.runAction(cc.moveTo(1, cc.v2(parent.x, parent.y - 100)));
    }

    deadEnd() {
        let ani = this.node.getComponent(cc.Animation);
        ani.play("waitClip")
        this.node.parent.runAction(
            cc.sequence(
                cc.fadeOut(0.5),
                cc.callFunc(() => {
                    this.node.angle = 0;
                })
            )
        );
    }

    //------------------------walk 左脚------------------

    walkFootStep1() {
        this.audioManager.playAudio(this.audioName.walkName);
    }
    //右脚
    walkFootStep2() {
        this.audioManager.playAudio(this.audioName.walkName);
    }



}

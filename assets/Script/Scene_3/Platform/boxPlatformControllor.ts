import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import audioControllor from "../../Common/Audio/audioControllor";
import audioSetting from "../../Common/Audio/audioSetting";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.Float)
    tempHeight: number = -200; //下降的高度 默认值

    isDown: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    maxPos: cc.Vec2 = null;
    minPos: cc.Vec2 = null;
    body: cc.RigidBody = null;
    phyBody: cc.PhysicsBoxCollider = null;
    audioSource: audioControllor = null;
    platAudioID = 0;
    isPlayAudio: boolean = false;

    start() {
        this.maxPos = this.node.position;
        this.minPos = cc.v2(this.maxPos.x, this.maxPos.y + this.tempHeight);
        this.body = this.node.getComponent(cc.RigidBody);
        this.phyBody = this.node.getComponent(cc.PhysicsBoxCollider);
        this.audioSource = cc.find("UICamera/audio").getComponent("audioControllor");

    }

    logicUpdate(dt) {
        let pos = this.node.position;
        this.node.x = this.maxPos.x;
        if (!this.isDown) { //上升
            if (pos.y >= this.maxPos.y) {
                this.body.type = cc.RigidBodyType.Static;
                this.phyBody.apply()

            }

        } else {  //下降
            if (pos.y <= this.minPos.y) {
                this.body.type = cc.RigidBodyType.Static;
                this.phyBody.apply()
            }
        }
        //音效
        if (this.body.type == cc.RigidBodyType.Dynamic && !this.isPlayAudio) {
            this.isPlayAudio = true;
            this.platAudioID = this.audioSource.playAudio(audioSetting.other.lv3.platform)
        } else {
            this.audioSource.stopAudioById(this.platAudioID)
            this.isPlayAudio = false;
        }

    }

    //物理碰撞
    onBeginContact(contact, self, other) {
        if (other.node.groupIndex == 2) {
            this.audioSource.playAudio(audioSetting.box.crash.onWood)
        }
    }
    onEndContact(contact, self, other) {

    }

    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 2) {//box 
            if (!this.isDown) {
                this.isDown = true;
                this.body.gravityScale = 1;
                this.body.type = cc.RigidBodyType.Dynamic;
                this.phyBody.apply()
            }
        }
    }

    onCollisionStay(other, self) {
        if (other.node.groupIndex == 2) {//box 
            if (!this.isDown) {
                this.isDown = true;
            }
        }
    }
    onCollisionExit(other, self) {
        if (other.node.groupIndex == 2) {//box 
            if (this.isDown) {

                this.isDown = false;
                this.body.gravityScale = -5;
                this.body.type = cc.RigidBodyType.Dynamic;
                this.phyBody.apply()
            }
        }
    }

}

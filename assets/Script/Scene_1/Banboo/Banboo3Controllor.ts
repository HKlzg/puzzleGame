
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import settingBasic from "../../Setting/settingBasic";
import toolsBasics from "../../Tools/toolsBasics";

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.Node)
    waterLeft: cc.Node = null;

    @property(cc.Node)
    banboo2Water: cc.Node = null;
    @property(cc.Node)
    fireLeftList: Array<cc.Node> = []
    @property(cc.Node)
    map: cc.Node = null;
    time: number = 1.1;
    isAudioPlaying: boolean = false;
    audio: any = null
    hasWater: boolean = false;

    start() {
        this.audio = cc.find("UICamera/audio").getComponent("audioControllor");

    }
    onEnable() {
        this.node.parent.getComponent(cc.WheelJoint).apply();
    }
    logicUpdate(dt) {
        this.waterContrl();
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
                let id = this.audio.playAudio("climbs");
            }
        }
    }
    onPostSolve(contact, selfCollider, otherCollider) {
        selfCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0)
        let angle = selfCollider.node.getComponent(cc.RigidBody).angularVelocity;
        selfCollider.node.getComponent(cc.RigidBody).angularVelocity = angle * 0.8;

    }
    waterContrl() {
        if (!this.banboo2Water.active) return

        let angle = this.node.angle
        if (angle >= 0 && angle <= 5) {
            if (!this.hasWater) {
                this.hasWater = true;
                this.schedule(this.waterStream, 1, 0);
            }
        } else {
            this.unschedule(this.waterStream)
            this.waterLeft.active = false;
            this.hasWater = false;
        }
    }

    waterStream() {
        this.waterLeft.active = true;
        //持续浇水4S 火才能熄灭
        this.schedule(() => {
            //4S之后检测水是否处于开启状态
            if (this.waterLeft.active) {
                this.fireLeftList.forEach((fire) => {
                    fire.runAction(cc.sequence(
                        cc.fadeOut(2),
                        cc.callFunc(() => {
                            this.map.active = true;
                        })
                    )
                    )
                })
            }

        }, 4)
    }


}

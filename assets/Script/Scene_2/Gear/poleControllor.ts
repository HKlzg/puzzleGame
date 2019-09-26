import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import audioControllor from "../../Common/Audio/audioControllor";
import audioSetting from "../../Common/Audio/audioSetting";

const { ccclass, property } = cc._decorator;
const type = cc.Enum({
    H: 0,
    V: 1
})
//齿轮 上的杆子控制器
@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    gear: cc.Node = null;

    @property({ type: type })
    poleType = type.H;
    audioSource: audioControllor = null;
    isPlaying = false;
    // onLoad () {}
    start() {
        this.audioSource = cc.find("UICamera/audio").getComponent("audioControllor");

    }

    logicUpdate(dt) { }

    //在物理碰撞之前
    onPreSolve(contact, self, other) {

        //碰撞到箱子 而且 只有水平 位置的有效
        if (other.node.groupIndex == 2 && this.poleType == type.H) {
            //音效
            let vy = other.node.getComponent(cc.RigidBody).linearVelocity.y;

            // if (vy < -0.1 && !this.isPlaying) {
            //     this.isPlaying = true;
            //     this.audioSource.playAudio(audioSetting.box.crash.onWood);
            // }

            let gearCtrl = this.gear.getComponent("bigGearControllor");
            let isRotation = gearCtrl.getIsRotation();
            if (!isRotation) {
                let otherBody: cc.RigidBody = other.node.getComponent(cc.RigidBody);

                if (otherBody.linearVelocity.y < -50) {
                    let otherPos = other.node.convertToWorldSpaceAR(cc.Vec2.ZERO)
                    let referencePos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);

                    let ang = 0;
                    if (otherPos.x < referencePos.x) {//逆时针旋转 angle ++
                        ang = 90;
                    } else {
                        ang = -90;
                    }
                    //旋转 整个父节点
                    gearCtrl.rotation(ang);

                }
            }
        }
    }

    onBeginContact(con, self, other) {
        if (other.node.groupIndex == 2 && this.poleType == type.H) {
            //音效
            let vy = other.node.getComponent(cc.RigidBody).linearVelocity.y;
            if (vy < -10 && !this.isPlaying) {
                this.isPlaying = true;
                this.audioSource.playAudio(audioSetting.box.crash.onWood,false,0.2,0.2);
            }
        }
    }

    onPostSolve(contact, self, other) {
        this.isPlaying = false;
    }

    public changePoleType() {
        this.poleType = this.poleType == type.H ? type.V : type.H;
    }
}

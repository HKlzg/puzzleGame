
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.Node)
    waterLeft: cc.Node = null;

    @property(cc.Node)
    banboo2Water: cc.Node = null;
    @property(cc.Node)
    fireLeftList: Array<cc.Node> = []

    hasWater: boolean = false;
    canvas: cc.Node = null;

    start() {
        this.canvas = cc.find("Canvas");

    }

    logicUpdate(dt) {
        this.waterContrl();

    }
    onPostSolve(contact, selfCollider, otherCollider) {
        selfCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0)
        let angle = selfCollider.node.getComponent(cc.RigidBody).angularVelocity;
        selfCollider.node.getComponent(cc.RigidBody).angularVelocity = angle * 0.8;
        // let vel: cc.Vec2 = otherCollider.node.getComponent(cc.RigidBody).linearVelocity;
        // let maxVel = vel.normalize().mul(100);
        // otherCollider.node.getComponent(cc.RigidBody).linearVelocity = vel > maxVel ? maxVel : vel;
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
                            this.canvas.emit(setting.gameEvent.gameMoveStep, 2)
                        })
                    )
                    )
                })
            }

        }, 4)
    }


}

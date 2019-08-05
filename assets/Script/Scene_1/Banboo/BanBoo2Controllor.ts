
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    waterLeft: cc.Node = null;
    @property(cc.Node)
    mask: cc.Node = null;
    @property(cc.Node)
    banboo3Node: cc.Node = null;
    @property(cc.Node)
    fireLeftList: Array<cc.Node> = []

    hasWater: boolean = false;
    maskInitHeight: number = 0;

    canvas: cc.Node = null;
    start() {
        this.maskInitHeight = this.mask.height;
        this.canvas = cc.find("Canvas");
    }

    update(dt) {
        this.waterContrl();
        this.maskContrl();
    }
    onPostSolve(contact, selfCollider, otherCollider) {
        selfCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0)
        let angle = selfCollider.node.getComponent(cc.RigidBody).angularVelocity;
        selfCollider.node.getComponent(cc.RigidBody).angularVelocity = angle * 0.5;
        let vel: cc.Vec2 = otherCollider.node.getComponent(cc.RigidBody).linearVelocity;
        otherCollider.node.getComponent(cc.RigidBody).linearVelocity.x = vel.normalizeSelf().mulSelf(5)
    }

    waterContrl() {
        let angle = this.node.angle
        angle = angle >= 360 ? angle % 360 : angle;

        if (angle >= 180 && angle <= 190) {
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
                    fire.runAction(cc.sequence(cc.fadeOut(2),
                        cc.callFunc(() => {
                            this.canvas.emit(setting.gameEvent.gameMoveStep, 1)
                        })))
                })
            }

        }, 4)
    }

    maskContrl() {

        if (!this.hasWater) return
        // 根据banboo 3
        let banboo3Angle = this.banboo3Node.angle;
        banboo3Angle = banboo3Angle > 360 ? banboo3Angle % 360 : banboo3Angle;

        if (banboo3Angle >= -30 && banboo3Angle <= 5) {

            //控制mask 
            let maxAngle = 1 - -31;
            let height = this.maskInitHeight - Math.abs((banboo3Angle - -30) / maxAngle * (this.maskInitHeight - 35))
            this.mask.height = height;

        } else {
            this.mask.height = this.maskInitHeight
        }
    }
}

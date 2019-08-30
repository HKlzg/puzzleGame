

import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
const { ccclass, property } = cc._decorator;
const direction = cc.Enum({
    Stop: 0,
    Left: 1,
    Right: 2
})

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    waterLeft: cc.Node = null;
    @property(cc.Node)
    waterRight: cc.Node = null;
    @property(cc.Node)
    banboo2Water: cc.Node = null;
    @property(cc.Node)
    fireLeftList: Array<cc.Node> = []
    @property(cc.Node)
    fireRightList: Array<cc.Node> = []

    waterDirection: number = 0;
    canvas: cc.Node = null;

    start() {
        this.waterDirection = direction.Stop;
        this.canvas = cc.find("Canvas");

    }

    logicUpdate(dt) {
        this.waterContrl()

        // if (this.waterDirection == direction.Stop) {

        // } else if (this.waterDirection == direction.Left) {

        // } else if (this.waterDirection == direction.Right) {

        // }


    }
    onPostSolve(contact, selfCollider, otherCollider) {
        selfCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0)
        let angle = selfCollider.node.getComponent(cc.RigidBody).angularVelocity;
        selfCollider.node.getComponent(cc.RigidBody).angularVelocity = angle * 0.8;
        // let vel: cc.Vec2 = otherCollider.node.getComponent(cc.RigidBody).linearVelocity;
        // let maxVel = vel.normalize().mul(100);
        // let linearVelocity = otherCollider.node.getComponent(cc.RigidBody);
        //.linearVelocity = vel > maxVel ? maxVel : vel;
        // if (linearVelocity.y >= -50 && linearVelocity.y < 0) {
        //     otherCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0)
        // } else {
        // }
        // otherCollider.node.getComponent(cc.RigidBody).linearVelocity = vel > maxVel ? maxVel : vel;
    }


    waterContrl() {
        if (this.banboo2Water.active) {
            this.waterDirection = direction.Stop;
            this.waterLeft.active = false;
            this.waterRight.active = false;
            return;
        } else {
            let angle = this.node.angle;
            if (angle > 0) {
                this.unschedule(this.rightStream)
                if (this.waterDirection != direction.Left) {
                    this.waterDirection = direction.Left;
                    this.waterRight.active = false;
                    this.schedule(this.leftStream, 1, 0);

                }

            } else if (angle < 0) {
                this.unschedule(this.leftStream)
                if (this.waterDirection != direction.Right) {
                    this.waterDirection = direction.Right;
                    this.waterLeft.active = false;

                    this.schedule(this.rightStream, 1, 0);

                }
            } else {
                this.waterDirection = direction.Stop;
                this.waterLeft.active = false;
                this.waterRight.active = false;
            }
        }
    }

    leftStream() {
        this.waterLeft.active = true;
        //持续浇水4S 火才能熄灭
        this.schedule(() => {
            //指定角度才能浇灭
            let angle = this.node.angle;
            if (angle > 0 && angle <= 24) {
                //4S之后检测水是否处于开启状态
                if (this.waterLeft.active) {
                    this.fireLeftList.forEach((fire) => {
                        fire.runAction(
                            cc.sequence(
                                cc.fadeOut(2),
                                cc.callFunc(() => {
                                    this.canvas.emit(setting.gameEvent.gameMoveStep, 3)
                                })
                            )
                        )
                    })
                }
            }

        }, 4)

    }
    rightStream() {
        this.waterRight.active = true;
        //4S之后检测水是否处于开启状态
        this.schedule(() => {
            //指定角度才能浇灭
            let angle = this.node.angle;
            if (angle >= -16 && angle < 0) {
                if (this.waterRight.active) {
                    this.fireRightList.forEach((fire) => {
                        fire.runAction(
                            cc.sequence(
                                cc.fadeOut(2),
                                cc.callFunc(() => {
                                    this.canvas.emit(setting.gameEvent.gameMoveStep, 4)
                                })
                            )
                        )
                    })
                }
            }
        }, 4)
    }


}

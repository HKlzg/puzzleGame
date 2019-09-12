

import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import settingBasic from "../../Setting/settingBasic";
import toolsBasics from "../../Tools/toolsBasics";
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
    @property(cc.Node)
    paper: cc.Node = null;
    @property(cc.Node)
    gear: cc.Node = null;

    isAudioPlaying: boolean = false;

    time: number = 1.1;

    audio: any = null;


    waterDirection: number = 0;
    currScene: cc.Node = null;

    start() {
        this.audio = cc.find("UICamera/audio").getComponent("audioControllor");
        this.waterDirection = direction.Stop;
        this.currScene = cc.find("Canvas/" + settingBasic.game.currScene);
    }
    onEnable() {
        this.node.parent.getComponent(cc.WheelJoint).apply();
    }
    logicUpdate(dt) {
        this.waterContrl()
        if (this.isAudioPlaying) {
            if (this.time < 1) {
                this.time += 0.1;
            } else {
                this.isAudioPlaying = false;
            }
        }
    }
    onPostSolve(contact, selfCollider, otherCollider) {
        selfCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0)
        let angle = selfCollider.node.getComponent(cc.RigidBody).angularVelocity;
        selfCollider.node.getComponent(cc.RigidBody).angularVelocity = angle * 0.8;
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
                        if (fire.active) {
                            fire.runAction(
                                cc.sequence(
                                    cc.fadeOut(2),
                                    cc.callFunc(() => {
                                        fire.active = false;
                                        this.paper.active = true;
                                        cc.tween(this.paper).then(cc.fadeIn(0.5)).call(() => {
                                            this.paper.getComponent(cc.Button).enabled = true;
                                        }).start();
                                        this.currScene.emit(setting.gameEvent.gameMoveStep, 3)
                                    })
                                )
                            )
                        }
                    })
                }
            }

        }, 2.5)


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
                        if (fire.active) {
                            fire.runAction(
                                cc.sequence(
                                    cc.fadeOut(2),
                                    cc.callFunc(() => {
                                        fire.active = false;
                                        this.gear.active = true;
                                        cc.tween(this.gear).then(cc.fadeIn(0.5)).call(() => {
                                            this.gear.getComponent(cc.Button).enabled = true;
                                        }).start();
                                        this.currScene.emit(setting.gameEvent.gameMoveStep, 4)
                                    })
                                )
                            )
                        }
                    })
                }
            }
        }, 2.5)
    }

}

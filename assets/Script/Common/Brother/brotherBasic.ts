
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";

const actionType = settingBasic.setting.actionType;
const actionDirection = settingBasic.setting.actionDirection;

@ccclass
export class BrotherBasic extends cc.Component {
    @property(cc.Node)
    brotherWalkNode: cc.Node = null; //行走动画对象
    @property(cc.Node)
    brotherClimbNode: cc.Node = null; //背对 攀爬动画对象
    @property(cc.Node)
    Circerl: cc.Node = null;

    brotherAnimation: cc.Animation = null;
    isMove: boolean = false;
    rigidBody: cc.RigidBody = null;
    collider: cc.PhysicsBoxCollider = null;

    anmstate = null;

    //方向 L/R/U/D 
    //动作 WAIT/WALK/CLIMB //msg-其他信息
    order: { direction: number, action: number, msg?: any } = null;
    //是否处于播放动画状态
    isPlaying: boolean = false;

    onLoad() {
        this.brotherAnimation = this.brotherWalkNode.getComponent(cc.Animation);
        this.node.on(settingBasic.gameEvent.brotherActionEvent, this.brotherAction, this);
        this.order = { direction: actionDirection.Left, action: actionType.Wait };
        //初始状态
        this.brotherWalkNode.active = true;
        this.brotherClimbNode.active = false;

        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.rigidBody = this.node.getComponent(cc.RigidBody);

        //注册事件
        this.brotherAnimation.on(cc.Animation.EventType.FINISHED, this.animationStop, this);
        this.brotherAnimation.on(cc.Animation.EventType.PLAY, this.animationPlay, this);

        this.rigidBody.linearDamping = 12;

    }

    start() {
    }

    //更新动作
    brotherAction(msg: { direction: number, action: number }) {
        if (this.isPlaying) return;

        this.order = msg;
        this.node.scaleX =
            (this.order.direction == actionDirection.Left || this.order.direction == actionDirection.Up_Left) ? -1 : 1;

        switch (this.order.action) {
            case actionType.Wait:
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("WaitClip");
                this.isMove = false;
                this.Circerl.active = false;

                break;
            case actionType.Walk:
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("WalkClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;

            case actionType.Climb: //背对着爬
                this.brotherWalkNode.active = false;
                this.brotherClimbNode.active = true;
                this.anmstate = this.brotherAnimation.play("ClimbClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;

            case actionType.Climb_Left: //左侧身爬
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("ClimbClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;

            case actionType.Climb_Right: //右侧身爬
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("ClimbClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;

            case actionType.Jump: //跳跃
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;

                this.isMove = true;
                this.Circerl.active = false;
                break;

            case actionType.MAGIC:
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("MagicClip");

                this.Circerl.emit(settingBasic.gameEvent.changeCircleColor, "white");
                this.Circerl.setPosition(this.Circerl.parent.convertToNodeSpaceAR((this.node.convertToWorldSpace(cc.v2(0, 0)))));
                this.Circerl.active = true;
                this.isMove = true;

                break;
            case actionType.No_Magic:
                //无法产生箱子时
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("MagicClip");

                this.Circerl.emit(settingBasic.gameEvent.changeCircleColor, "red");
                this.Circerl.setPosition(this.Circerl.parent.convertToNodeSpaceAR((this.node.convertToWorldSpace(cc.v2(0, 0)))));
                this.Circerl.active = true;
                this.isMove = true;

                break;
            default:
                break;
        }

    }

    update(dt) {
        //更新位置
        if (this.isMove) {
            switch (this.order.action) {
                case actionType.Wait:

                    break;
                case actionType.Walk:
                    this.node.scaleX > 0 ? this.node.x += 2
                        : this.node.x -= 2;

                    break;
                case actionType.Climb:
                    this.order.direction == actionDirection.Up ? this.node.y += 2 : this.node.y -= 2;
                    break;

                case actionType.Jump:
                    let pos: cc.Vec2 = this.node.position;
                    let tmpPos = this.order.msg;
                    let time = tmpPos.y / 200 * 0.8; //根据动画的原本时间计算

                    tmpPos = { x: tmpPos.x, y: tmpPos.y }; //放大倍数

                    tmpPos.x = tmpPos.x >= 200 ? 200 : tmpPos.x;
                    tmpPos.y = tmpPos.y >= 200 ? 200 : tmpPos.y;

                    time = time < 0.1 ? 0.1 : time;
                    time = time > 0.8 ? 0.8 : time;
                    // console.log("===========tmpPos " + tmpPos.x + "  ; " + tmpPos.y + " time = " + time)
                    this.brotherAnimation.play("JumpClip").speed = (1 - time) + 1;

                    let action = cc.jumpTo(time, cc.v2(pos.x + tmpPos.x, pos.y), tmpPos.y, 1);

                    let isDone = this.node.runAction(action).isDone
                    if (isDone) {
                        this.isMove = false;
                    }
                    break;
                case actionType.MAGIC:

                    break;

                default:
                    break;
            }
        }
        this.collider ? this.collider.apply() : null;
    }

    //-------------Animation--Event---------
    animationPlay(event) {
        if (this.order.action == actionType.Jump) {
            this.isPlaying = true;
        }
    }

    animationStop(event) {
        if (this.order.action == actionType.Jump) {
            this.isPlaying = false;
            // console.log("=====2===Finish isPlaying= " + this.isPlaying);
            switch (this.order.action) {
                case actionType.Jump:
                    this.brotherAction({ direction: this.order.direction, action: actionType.Wait })
                    break;

                default:
                    break;
            }
        }
    }


}

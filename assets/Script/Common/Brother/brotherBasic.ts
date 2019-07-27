
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";

const actionType = settingBasic.setting.actionType;
const actionDirection = settingBasic.setting.actionDirection;

@ccclass
export class BrotherBasic extends cc.Component {
    @property(cc.Node)
    brotherWalkNode: cc.Node = null;
    @property(cc.Node)
    brotherClimbNode: cc.Node = null;
    @property(cc.Node)
    Circerl: cc.Node = null;

    brotherAnimation: cc.Animation = null;
    isMove: boolean = false;
    rigidBody: cc.RigidBody = null;
    collider: cc.PhysicsBoxCollider = null;

    anmstate = null;

    //方向 L/R/U/D 
    //动作 WAIT/WALK/CLIMB
    order: { direction: number, action: number } = null;
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

            case actionType.Climb:
                this.brotherWalkNode.active = false;
                this.brotherClimbNode.active = true;
                this.anmstate = this.brotherAnimation.play("ClimbClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;
            case actionType.Jump:
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("JumpClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;
            case actionType.MAGIC:
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("MagicClip");

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
                    let action = cc.spawn(
                        cc.moveTo(0.5, pos.x, pos.y + 80),
                        cc.moveTo(0.5, pos.x + 50, pos.y),
                    )
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
            this.collider ? this.collider.apply() : null;
        }
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

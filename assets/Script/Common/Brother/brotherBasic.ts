
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";

const actionType = settingBasic.setting.actionType;
const actionDirection = settingBasic.setting.actionDirection;

@ccclass
export abstract class BrotherBasic extends cc.Component {
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

    //用于子类使用
    actionType = actionType;
    actionDirection = actionDirection;

    anmstate = null;

    //方向 L/R/U/D 
    //动作 WAIT/WALK/CLIMB //msg-其他信息
    order: { direction: number, action: number, msg?: any } = null;
    //上一个指令
    preOrder: { direction: number, action: number, msg?: any } = null;
    //是否处于播放动画状态
    isPlaying: boolean = false;
    //是否准备爬箱子 或者推箱子
    isReadyClimbBox: boolean = false;
    // isPushBox: boolean = false;

    //推动的对象
    pushObject: cc.Node = null;
    //射线检测的X长度
    rayWidth: number = 40;
    onLoad() {
        this.brotherAnimation = this.brotherWalkNode.getComponent(cc.Animation);
        this.node.on(settingBasic.gameEvent.brotherActionEvent, this.brotherAction, this);
        this.node.on(settingBasic.gameEvent.brotherPlayState, this.setPlayState, this);
        this.order = { direction: actionDirection.Left, action: actionType.Wait };
        //初始状态
        this.brotherWalkNode.active = true;
        this.brotherClimbNode.active = false;

        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.rigidBody = this.node.getComponent(cc.RigidBody);

        //注册事件
        this.brotherAnimation.on(cc.Animation.EventType.PLAY, this.animationPlay, this);
        // this.brotherAnimation.on(cc.Animation.EventType.FINISHED, this.animationStop, this);

    }

    start() {
    }

    //更新动作
    brotherAction(msg: { direction: number, action: number }, fun?: any) {
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
                if (this.preOrder &&
                    this.preOrder.action == actionType.ReadyPush
                    && this.preOrder.direction == this.order.direction
                ) {
                    //切换为推
                    this.order.action = actionType.Push;
                    this.brotherAction(this.order);
                    return;
                } else {
                    //非准备推的动作时 切换为行走
                    this.anmstate = this.brotherAnimation.play("WalkClip");
                }
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

            case actionType.Push:
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("PushClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;

            case actionType.ReadyPush://准备爬箱子 或者 推箱子
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("ReadyPushClip");
                this.isMove = true;
                this.Circerl.active = false;

                this.isReadyClimbBox = false;
                break;

            case actionType.ClimbBox: //爬箱子
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.isPlaying = true;
                this.anmstate = this.brotherAnimation.play("ClimbBoxClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;

            case actionType.Jump: //跳跃

                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.isPlaying = true;
                this.anmstate = this.brotherAnimation.play("JumpClip").speed = 1.5;

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

        this.preOrder = this.order;
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
                case actionType.Push:
                    this.node.scaleX > 0 ? this.node.x += 2
                        : this.node.x -= 2;

                    break;
                case actionType.Climb:
                    this.order.direction == actionDirection.Up ? this.node.y += 2 : this.node.y -= 2;
                    break;

                case actionType.Jump:
                    let pos: cc.Vec2 = this.node.position;
                    let time = 0.8;

                    let action = cc.jumpTo(time, cc.v2(pos.x, pos.y), 200, 1);

                    this.node.runAction(
                        cc.sequence(action,
                            cc.callFunc(() => {
                                this.isMove = false;
                                this.isPlaying = false;
                                this.order.action = actionType.Wait;
                                this.brotherAction(this.order)
                            }))
                    )
                    break;
                case actionType.MAGIC:

                    break;

                default:
                    break;
            }
        }

        //射线检测
        if (!this.isReadyClimbBox && (this.preOrder && this.preOrder.action != actionType.ReadyPush &&
            !this.isPlaying && this.preOrder.action != actionType.Push
        )) {
            this.rayCheck();
        } else if (this.preOrder && this.preOrder.action != actionType.Push &&
            this.preOrder.action != actionType.ReadyPush) {

            let direc = this.node.scaleX > 0 ? actionDirection.Right : actionDirection.Left;
            this.order = { direction: direc, action: actionType.ReadyPush };
            this.brotherAction(this.order);

        }
        this.pushCheck();
        this.toUpdate();
        this.collider ? this.collider.apply() : null;

    }
    abstract toUpdate();
    //射线检测
    abstract rayCheck();

    pushCheck() {
        // 若左右切换方向时 准备推的动作取消
        if (this.preOrder && this.order &&
            this.preOrder.action == actionType.ReadyPush &&
            this.order.action == actionType.Walk
        ) {
            if (this.preOrder.direction != this.order.direction) {
                this.isReadyClimbBox = false;
            }
        }
        //推动物体的距离小于 指定距离 取消推 的动作 ,替换为走
        if (this.pushObject && this.preOrder &&
            this.preOrder.action != actionType.Wait
        ) {
            let pos1 = this.pushObject.convertToWorldSpace(cc.Vec2.ZERO);
            pos1 = cc.v2(pos1.x + this.pushObject.width, pos1.y)
            let pos2 = this.node.convertToWorldSpace(cc.Vec2.ZERO);

            if (Math.abs(pos1.x - pos2.x) >= this.rayWidth) {
                this.order.action = actionType.Wait;
                this.brotherAction(this.order);
                this.pushObject = null;
            }
        }
    }
    //-------------Animation--Event---------
    animationPlay(event) {
        if (this.order.action == actionType.Jump ||
            this.order.action == actionType.ClimbBox ||
            this.order.action == actionType.Climb
        ) {
            this.isPlaying = true;
        }
    }

    //触发异常
    animationStop(event) {
        if (this.order.action == actionType.Jump ||
            this.order.action == actionType.ClimbBox ||
            this.order.action == actionType.Climb) {

            this.isPlaying = false;
            switch (this.order.action) {
                case actionType.Jump:
                    this.brotherAction({ direction: this.order.direction, action: actionType.Wait })
                    break;

                default:
                    break;
            }
        }

    }

    //碰撞检测
    onBeginContact(contact, self, other) {
    }

    setPlayState(isPlay) {
        this.isPlaying = isPlay;
    }


}

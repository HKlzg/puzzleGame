
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

    //距离推动物体的距离
    pushDistance: number = 0;

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
                    this.isPlaying = false;
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

            case actionType.ReadyPush://准备 推箱子
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("ReadyPushClip");
                this.isMove = true;
                this.Circerl.active = false;

                this.isReadyClimbBox = false;

                let pos1 = this.pushObject.convertToNodeSpace(cc.Vec2.ZERO);
                let pos2 = this.brotherWalkNode.convertToNodeSpace(cc.Vec2.ZERO);
                this.pushDistance = Math.abs(pos1.x - pos2.x);
                break;

            // case actionType.ClimbBox: //爬箱子
            //     this.brotherWalkNode.active = true;
            //     this.brotherClimbNode.active = false;
            //     this.isPlaying = true;
            //     this.anmstate = this.brotherAnimation.play("ClimbBoxClip");
            //     this.isMove = true;
            //     this.Circerl.active = false;
            //     break;

            case actionType.Jump: //跳跃
                // console.log("=============jump==Start=")
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.isPlaying = true;
                let x = 0;
                if (this.order.direction == actionDirection.Up) {
                    x = 0;
                } else {
                    x = this.order.direction == actionDirection.Up_Left ? -150 : 150;
                }
                this.brotherWalkNode.emit(settingBasic.gameEvent.brotherJumpEvent, x);

                this.anmstate = this.brotherAnimation.play("JumpClip").speed = 1.5;

                this.isMove = true;
                this.Circerl.active = false;
                break;

            case actionType.MAGIC:
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.isPlaying = true;
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
                this.isPlaying = true;
                this.anmstate = this.brotherAnimation.play("MagicClip");

                this.Circerl.emit(settingBasic.gameEvent.changeCircleColor, "red");
                this.Circerl.setPosition(this.Circerl.parent.convertToNodeSpaceAR((this.node.convertToWorldSpace(cc.v2(0, 0)))));
                this.Circerl.active = true;
                this.isPlaying = false;

                break;
            default:
                break;
        }

        this.preOrder = this.order;
    }

    update(dt) {
        //更新位置 只对持续位移的动作  JUMP/Climb动画位移在动画帧事件中写
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
                default:
                    break;
            }
        }

        //射线检测
        if (!this.isReadyClimbBox &&
            (this.preOrder && this.preOrder.action != actionType.ReadyPush &&
                !this.isPlaying && this.preOrder.action != actionType.Push)
        ) {
            this.rayCheck();
        }

        this.pushCheck();
        this.toUpdate();
        this.isOnGround();

        this.collider ? this.collider.apply() : null;

    }
    abstract toUpdate();
    //射线检测
    abstract rayCheck();

    //离地检测
    isOnGround() {
        if (!this.isPlaying && this.rigidBody.linearVelocity.y < -5) {
            this.order.action = actionType.Wait;
            this.brotherAction(this.order)
        }
    }
    //取消推的动作检测
    pushCheck() {
        if (this.order &&
            (this.order.action != actionType.ReadyPush ||
                this.order.action != actionType.Push &&
                this.isReadyClimbBox
            )
        ) {
            this.isReadyClimbBox = false;
            this.pushObject = null;
            // console.log("=====0=====cancle push ===")
            return;
        }

        // 若左右切换方向时 准备推的动作取消
        if (this.preOrder && this.order &&
            this.preOrder.action == actionType.ReadyPush &&
            this.preOrder.direction != this.order.direction
        ) {
            this.isReadyClimbBox = false;
            this.pushObject = null;
            // console.log("=====1=====cancle push ===")
            return;
        }
        //推动物体的距离大于 指定距离 取消推 的动作 ,替换为走
        if (this.pushObject && this.preOrder &&
            this.preOrder.action != actionType.Wait
        ) {
            let pos1 = this.pushObject.convertToWorldSpace(cc.Vec2.ZERO);
            let pos2 = this.node.convertToWorldSpace(cc.Vec2.ZERO);
            let dist = Math.abs(pos1.x - pos2.x)
            if (dist > this.pushDistance + 10) {
                this.order.action = actionType.Wait;
                this.brotherAction(this.order);
                this.pushObject = null;
                // console.log("=====2=====cancle push ===dist: " + dist + "  dist2: " + this.pushDistance)
                return;
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
        // console.log("=====setPlayState: "+ this.isPlaying)
    }


}


const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";

const actionType = settingBasic.setting.actionType;
const actionDirection = settingBasic.setting.actionDirection;

@ccclass
export abstract class BrotherBasic extends cc.Component {
    @property(cc.Node)
    brotherWalkNode: cc.Node = null; //行走动画对象
    // @property(cc.Node)
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
    cameraNode: cc.Node = null;

    bornPos: cc.Vec2 = null;
    //死亡次数
    deadNum: number = 0;
    isDeath: boolean = false;
    canvas: cc.Node = null;

    //操作提示
    operationTip: cc.Node = null;
    onLoad() {
        this.brotherAnimation = this.brotherWalkNode.getComponent(cc.Animation);
        this.node.on(settingBasic.gameEvent.brotherActionEvent, this.brotherAction, this);
        this.node.on(settingBasic.gameEvent.brotherPlayState, this.setPlayState, this);
        this.node.on(settingBasic.gameEvent.brotherDeathEvent, this.reBirth, this);
        this.node.on(settingBasic.gameEvent.brotherSetBornPos, this.setReBornPosition, this);
        this.node.on(settingBasic.gameEvent.getBrotherAction, this.getBrotherAction, this);

        this.order = { direction: actionDirection.Right, action: actionType.Wait };
        //初始状态

        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.rigidBody = this.node.getComponent(cc.RigidBody);

        //注册事件
        this.brotherAnimation.on(cc.Animation.EventType.PLAY, this.animationPlay, this);
        // this.brotherAnimation.on(cc.Animation.EventType.FINISHED, this.animationStop, this);
        this.canvas = cc.find("Canvas");
        this.cameraNode = this.canvas.getChildByName("Camera");

        this.bornPos = this.node.position;//默认值
        this.node.scaleX = 1;

        this.operationTip = this.canvas.getChildByName("Camera Tips").getChildByName("operationTips");
    }

    start() {
    }

    //更新动作
    brotherAction(msg: { direction: number, action: number }, fun?: any) {
        if (this.isPlaying || this.isDeath || (this.anmstate && this.anmstate.isPlaying)) return;

        this.order = msg;
        if (this.order.direction == actionDirection.Left || this.order.direction == actionDirection.Up_Left ||
            this.order.direction == actionDirection.Down_left) {
            this.node.scaleX = -1
        } else if (this.order.direction != actionDirection.Up) {
            this.node.scaleX = 1;
        }

        switch (this.order.action) {
            case actionType.Wait:

                this.brotherAnimation.play("WaitClip");
                this.isMove = false;
                this.Circerl.active = false;

                break;
            case actionType.Walk:

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
                    this.brotherAnimation.play("WalkClip");
                    this.isPlaying = false;
                }
                this.isMove = true;
                this.Circerl.active = false;
                break;

            case actionType.QuietlyWalk:
                this.brotherAnimation.play("SquatClip");
                this.isMove = true;
                this.isPlaying = false;
                this.Circerl.active = false;
                break;

            case actionType.Push:
                this.anmstate = this.brotherAnimation.play("PushClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;

            case actionType.ReadyPush://准备 推箱子

                this.anmstate = this.brotherAnimation.play("ReadyPushClip");
                this.isMove = true;
                this.Circerl.active = false;

                this.isReadyClimbBox = false;

                let pos1 = this.pushObject.convertToNodeSpace(cc.Vec2.ZERO);
                let pos2 = this.brotherWalkNode.convertToNodeSpace(cc.Vec2.ZERO);
                this.pushDistance = Math.abs(pos1.x - pos2.x);
                break;

            // case actionType.ClimbBox: //爬箱子
            //      
            //     this.isPlaying = true;
            //     this.anmstate = this.brotherAnimation.play("ClimbBoxClip");
            //     this.isMove = true;
            //     this.Circerl.active = false;
            //     break;

            case actionType.Jump: //跳跃
                // console.log("=============jump==Start=")

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

                this.isPlaying = true;
                this.anmstate = this.brotherAnimation.play("MagicClip");

                this.Circerl.emit(settingBasic.gameEvent.changeCircleColor, "white");
                this.Circerl.setPosition(this.Circerl.parent.convertToNodeSpaceAR((this.node.convertToWorldSpace(cc.v2(0, 0)))));
                this.Circerl.active = true;
                this.isMove = true;

                break;
            case actionType.No_Magic:
                //无法产生箱子时
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
        if (!this.isDeath) {

            //更新位置 只对持续位移的动作  JUMP/Climb动画位移在动画帧事件中写
            if (this.isMove) {
                switch (this.order.action) {
                    case actionType.QuietlyWalk:
                        this.node.scaleX > 0 ? this.node.x += 1
                            : this.node.x -= 1;

                        break;
                    case actionType.Walk:
                        // this.node.scaleX > 0 ? this.node.x += 2
                        //     : this.node.x -= 2;
                        let temp = this.node.scaleX > 0 ? 2 : -2;
                        let pos = this.node.position;
                        this.node.runAction(cc.moveTo(dt, cc.v2(pos.x + temp, pos.y)));


                        break;
                    case actionType.Push:
                        this.node.scaleX > 0 ? this.node.x += 2
                            : this.node.x -= 2;
                        break;
                    default:
                        break;
                }
            }

            // //射线检测
            // if (!this.isReadyClimbBox &&
            //     (this.preOrder && this.preOrder.action != actionType.ReadyPush &&
            //         !this.isPlaying && this.preOrder.action != actionType.Push)
            // ) {
            //     this.rayCheck();
            // }

            this.pushCheck();
            this.toUpdate();
            this.isOnGround();
        }


        this.collider ? this.collider.apply() : null;

    }

    abstract toUpdate(dt?);
    //射线检测
    abstract rayCheck();

    //离地检测
    isOnGround() {

        if (!this.isPlaying && this.rigidBody.linearVelocity.y < -250) {
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

    //此事件触发异常
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

    //物理碰撞检测
    onBeginContact(contact, self, other) {
        if (other.node.groupIndex == 4) {
            //地面
            let pos = this.node.position;
            this.bornPos = cc.v2(pos.x, pos.y + 10)
        }

    }
    //碰撞检测(传感器)
    onCollisionEnter(other, self) {
        //被下落的箱子 砸中
        // if (other.node.groupIndex == 2) {
        //     let boxBody = other.node.getComponent(cc.RigidBody);
        //     if (boxBody.linearVelocity.y < -100) {
        //         this.canvas.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.REBORN);
        //     }

        // }
    }
    onCollisionEnd(other, self) {

    }


    //重生
    reBirth(isReborn) {
        if (!isReborn) return;

        this.isDeath = true;
        this.anmstate = this.brotherAnimation.play("DeadClip");
        this.collider.sensor = true;
        let pos = this.bornPos ? this.bornPos : this.node.position;
        //死亡数+1
        // let camera = this.cameraNode.getComponent(cc.Camera);
        this.deadNum++;
        //更改游戏状态 -重生中
        this.scheduleOnce(() => {

            this.order.action = actionType.Wait;
            this.brotherAction(this.order);
            this.node.position = cc.v2(pos.x, pos.y + this.node.height);
            this.rigidBody.linearVelocity = cc.v2(0, 0);
            this.collider.sensor = false;

            this.node.runAction(cc.fadeIn(1));

            this.node.angle = 0;
            this.isDeath = false;
            this.isPlaying = false;
            //更改游戏状态为-Normal 正常状态
            this.canvas.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.NORMAL);

        }, 2.5);
    }

    setPlayState(isPlay) {
        this.isPlaying = isPlay;
    }

    //设置重生地点
    setReBornPosition(pos: cc.Vec2) {
        this.bornPos = pos ? pos : this.bornPos;
    }

    getBrotherAction(msg, fun?) {
        if (fun) {
            fun(this.order.action)
        }

    }
}

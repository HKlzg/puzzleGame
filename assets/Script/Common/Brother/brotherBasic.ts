
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const actionType = settingBasic.setting.actionType;
const actionDirection = settingBasic.setting.actionDirection;

@ccclass
export class BrotherBasic extends LogicBasicComponent {
    @property(cc.Node)
    brotherWalkNode: cc.Node = null; //行走动画对象
    // @property(cc.Node)
    @property(cc.Node)
    Circerl: cc.Node = null;

    @property(cc.Node)
    passIn: cc.Node = null;

    @property(cc.Node)
    passOut: cc.Node = null;

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

    //距离推动物体的距离
    pushDistance: number = 0;
    cameraNode: cc.Node = null;

    bornPos: cc.Vec2 = null;
    //死亡次数
    deadNum: number = 0;
    isDeath: boolean = false;
    canvas: cc.Node = null;
    currScene: cc.Node = null; //当前场景节点
    //是否正在播放过场动画
    isPlayAutioClip: boolean = false;

    onLoad() {
        this.brotherAnimation = this.brotherWalkNode.getComponent(cc.Animation);
        this.node.on(settingBasic.gameEvent.brotherActionEvent, this.brotherAction, this);
        this.node.on(settingBasic.gameEvent.brotherPlayState, this.setPlayState, this);
        this.node.on(settingBasic.gameEvent.brotherDeathEvent, this.reBirth, this);
        this.node.on(settingBasic.gameEvent.brotherSetBornPos, this.setReBornPosition, this);
        this.node.on(settingBasic.gameEvent.getBrotherAction, this.getBrotherAction, this);

        this.node.on(settingBasic.gameEvent.brotherTransitionEvent, this.transitionAin, this);
        this.order = { direction: actionDirection.Right, action: actionType.Wait };
        //初始状态

        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.collider.friction = 1;
        //注册事件
        this.brotherAnimation.on(cc.Animation.EventType.PLAY, this.animationPlay, this);
        // this.brotherAnimation.on(cc.Animation.EventType.FINISHED, this.animationStop, this);
        this.canvas = cc.find("Canvas");
        this.currScene = this.canvas.getChildByName(settingBasic.game.currScene)
        this.cameraNode = this.currScene.getChildByName("Camera");

        this.bornPos = this.node.position;//默认值
        this.node.scaleX = 1;

    }

    start() {
    }

    //更新动作
    brotherAction(msg: { direction: number, action: number }, fun?: any) {
        if (this.isPlayAutioClip||this.isPlaying || this.isDeath || (this.anmstate && this.anmstate.isPlaying)) return;

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

                this.brotherAnimation.play("WalkClip");
                this.isPlaying = false;
                this.isMove = true;
                this.Circerl.active = false;
                break;

            case actionType.QuietlyWalk:
                let currLv = settingBasic.game.currLevel;
                if (currLv == 3) { //仅第三关使用 QuietlyWalk
                    this.brotherAnimation.play("SquatClip");
                } else {
                    this.order.action = actionType.Walk;
                    this.brotherAction(this.order, fun);
                }
                this.isMove = true;
                this.isPlaying = false;
                this.Circerl.active = false;
                break;
            case actionType.Jump: //跳跃
                //禁止空中连跳
                if (this.rigidBody.linearVelocity.y <= -400) return

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

    logicUpdate(dt) {
        if (!this.isDeath) {

            //更新位置 只对持续位移的动作  JUMP/Climb动画位移在动画帧事件中写
            if (this.isMove) {
                switch (this.order.action) {
                    case actionType.QuietlyWalk:
                        this.node.scaleX > 0 ? this.node.x += 1
                            : this.node.x -= 1;

                        break;
                    case actionType.Walk:
                        this.node.scaleX > 0 ? this.node.x += 3
                            : this.node.x -= 3;

                        break;

                    default:
                        break;
                }
            }

            this.isOnGround();
        }

        this.collider ? this.collider.apply() : null;
    }

    //离地检测
    isOnGround() {

        if (!this.isPlaying && this.rigidBody.linearVelocity.y < -250) {
            let lineVec = this.rigidBody.linearVelocity;
            this.order.action = actionType.Wait;
            this.brotherAction(this.order);
            this.rigidBody.linearVelocity = lineVec;

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


    }
    onCollisionEnd(other, self) {

    }

    //在物理碰撞之前调用
    onPreSolve(contact, self, other) {

        if (other.node.groupIndex == 2) {

            //防止碰撞之后 被弹飞的速度过大
            let lineVec = this.rigidBody.linearVelocity;

            if (Math.abs(lineVec.x) > 30) {
                let vx = this.rigidBody.linearVelocity.x;
                this.rigidBody.linearVelocity.x = vx > 0 ? 30 : -30;
            }
        }
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
        cc.tween(this.node).delay(2.5).call(() => {
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
            this.currScene.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.NORMAL);
            this.order.action = actionType.Wait;
            this.brotherAction(this.order);
        }).start();

    }

    //动画播放完之后调用  更改状态
    setPlayState(isPlay) {
        this.isPlaying = isPlay;

        //设置为等待状态
        if (this.order.action != actionType.Wait) {
            this.order.action = actionType.Wait;
            this.brotherAction(this.order);

        }
    }

    //设置重生地点
    setReBornPosition(pos: cc.Vec2) {
        this.bornPos = pos ? pos : this.bornPos;
    }

    //外部获取人物状态
    getBrotherAction(msg, fun?) {
        if (fun) {
            fun(this.order.action)
        }
    }

    //场景切换过渡行走动画 
    transitionAin(distance, time, direction, fun, passType) {
        this.isPlayAutioClip = true;
        this.node.scaleX = direction;
        this.brotherAnimation.play("WalkClip");
        this.isMove = false;
        this.isPlaying = false;
        //
        let passWidth = 0;
        let pos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let passPos = pos; //默认值
        let dist = 350; //默认距离
        if (!distance || distance == 0) {
            try {
                if (passType == "IN") {
                    passWidth = this.passIn.width;
                    passPos = this.passIn.convertToWorldSpaceAR(cc.Vec2.ZERO);
                } else {
                    passWidth = this.passOut.width;
                    passPos = this.passOut.convertToWorldSpaceAR(cc.Vec2.ZERO);
                }
            } catch (error) {
                console.log("=[error]==passOut / passIn== 为空=")
            }
            if (direction > 0) {
                //向右走 人在pass左边 人物宽度20 
                dist = passPos.x - pos.x + 20 + passWidth / 2 + 50;
            } else {
                dist = pos.x - passPos.x + 20 + passWidth / 2 + 50;
            }
        } else {
            dist = distance;
        }
        // console.log("=====dist= " + dist * direction)
        cc.tween(this.node).by(time, { x: dist * direction }).call(() => {
            fun ? fun() : null;
            this.isPlayAutioClip = false;
            this.order.action = actionType.Wait;
            this.order.direction = direction > 0 ? actionDirection.Right : actionDirection.Left;
            this.brotherAction(this.order);

        }).start();
    }


}

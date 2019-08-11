
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import toolsBasics from "../../Tools/toolsBasics";

//monster状态
const monsterActionType = cc.Enum({
    sleep: 0,
    standUp: 1,
    lieDown: 2, //过度 
    toSleep: 3, //走回sleep 地点
    warning: 4, //靠近人
    attack: 5, //攻击
    wait: 6,
})

//人物状态
const personActionType = setting.setting.actionType;

@ccclass
export default class LeopardControllor extends cc.Component {

    @property(cc.Node)
    personNode: cc.Node = null;
    @property(cc.Node)
    monsterNode: cc.Node = null;
    @property(cc.Node)
    sleepPosNode: cc.Node = null;

    monsterAnimation: cc.Animation = null;
    canvas: cc.Node = null;
    monsterActionState = monsterActionType.sleep;
    preActionState = monsterActionType.sleep;

    sleepPos: cc.Vec2 = null;
    isPersonDeath: boolean = false;

    personPrePos: cc.Vec2 = null;
    //monster是否是在观察中
    isObservePerson: boolean = false;
    //人物是否处于安全状态
    isSafePos: boolean = false;

    //是否处于降低状态中
    isReduceState: boolean = false;
    isWarning: boolean = false;
    isAttack: boolean = false;
    isSnoring: boolean = false;
    isPlayWaringAudio: boolean = false;
    isLieDown: boolean = false;

    audioManager = toolsBasics.getAudioManager();
    sleepAudioID: number = 0;
    warnAudioID: number = 0;

    //是否处于播放动画 状态
    isDoAction: boolean = false;
    //是否处于循环Action状态
    isLoopAction: boolean = true;

    //动作间隔
    actionTime = 2;

    isMonsterActionStart: boolean = false;
    start() {
        this.canvas = cc.find("Canvas");
        this.monsterAnimation = this.monsterNode.getComponent(cc.Animation);
        this.node.on(setting.gameEvent.monsterReduceState, this.setIsSafePos, this);
        this.node.on(setting.gameEvent.monsterStopPlayAction, this.stopPlayAction, this);

        this.sleepPos = this.sleepPosNode.position;

        //初始化1S后启动
        this.scheduleOnce(() => { this.isMonsterActionStart = true; }, 1)
    }

    update(dt) {
        //是否开始Action
        if (!this.isMonsterActionStart) return;

        this.isPersonDeath = setting.game.State == setting.setting.stateType.REBORN;
        //人没有死亡时 
        if (!this.isPersonDeath) {

            //人处于安全状态时
            if (this.isSafePos) {
                if (!this.isReduceState) {
                    this.isReduceState = true;
                    this.scheduleOnce(() => {
                        this.isReduceState = false;
                        this.reduceState();
                    }, 2)
                }
            } else {
                //人处于非安全地方
                // //根据当前状态 设置到下/上一级的延迟时间
                // switch (this.monsterActionState) {
                //     case monsterActionType.standUp:
                //         this.actionTime = 2;
                //         break;
                //     case monsterActionType.toSleep:
                //         this.actionTime = 2;
                //         break;
                //     case monsterActionType.warning:
                //         this.actionTime = 3;
                //         break;
                //     default: 
                //         break;
                // }
                if (!this.isObservePerson && this.isDoAction
                    && (this.monsterActionState == monsterActionType.sleep)
                ) {
                    this.isDoAction = false;
                }

                if (!this.isObservePerson && !this.isDoAction
                    && (this.monsterActionState == monsterActionType.sleep
                        || this.monsterActionState == monsterActionType.warning
                        || this.monsterActionState == monsterActionType.toSleep
                        || this.monsterActionState == monsterActionType.wait)
                ) {
                    this.isObservePerson = true;

                    this.scheduleOnce(() => {
                        console.log("=======Observe Person====")
                        this.isObservePerson = false;
                        //获取人物的状态
                        this.getPersonAction();
                    }, 1.5)
                }
            }

        } else {
            //人物死亡时 逐渐降低 状态
            if (!this.isReduceState) {
                this.isReduceState = true;
                this.scheduleOnce(() => {
                    this.isReduceState = false;
                    this.reduceState();
                }, 2)
            }
        }

        this.loopAction(dt)
    }
    //根据状态 播放音效 播放持续动画
    loopAction(dt) {
        switch (this.monsterActionState) {

            case monsterActionType.sleep:
                if (!this.isSnoring) {
                    this.isSnoring = true;
                    this.scheduleOnce(() => {
                        this.sleepAudioID = this.audioManager.playAudio("tigerSnoring") //鼾声
                        this.scheduleOnce(() => { this.isSnoring = false; }, 2);
                    }, 3)
                }

                break;
            case monsterActionType.warning:
                if (!this.isPlayWaringAudio) {
                    this.isPlayWaringAudio = true;
                    this.scheduleOnce(() => {
                        this.isPlayWaringAudio = false;
                        this.warnAudioID = this.audioManager.playAudio("heartBeat");
                    }, 1)
                }

                let pos = this.node.position;
                if (!this.isSafePos) {  //靠近 非安全区的人 

                    let personPos = this.personNode.convertToWorldSpace(cc.Vec2.ZERO);
                    let selfPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);
                    let dist = personPos.x - selfPos.x;
                    let speed = personPos.x >= selfPos.x ? 1 : -1;

                    this.node.scaleX = personPos.x >= selfPos.x ? 1 : -1;

                    if (Math.abs(dist) > 100) {
                        // console.log("====靠近person ===dist= " + dist)
                        let action = cc.moveTo(dt, cc.v2(pos.x + speed, pos.y));
                        this.node.runAction(action);
                    } else {
                        this.risingSate();
                    }
                } else {
                    this.reduceState();
                }

                break;

            default:
                break;
        }
    }
    //只执行一次
    doOnceAction() {
        let pos = this.node.position;

        switch (this.monsterActionState) {

            case monsterActionType.wait:
                this.monsterAnimation.play("WaitClip");
                break;

            case monsterActionType.sleep:
                this.monsterAnimation.play("SleepClip");

                break;
            case monsterActionType.standUp:
                this.isDoAction = true;
                this.monsterAnimation.play("StandUpClip");
                break;
            case monsterActionType.lieDown:
                console.log("====  lieDown  ====")
                this.isDoAction = true;
                this.monsterAnimation.play("LieDownClip");
                if (this.node.position.y == this.sleepPos.y) {
                    this.node.runAction(cc.moveTo(0.3, cc.v2(pos.x, pos.y - 50)))
                }
                break;

            case monsterActionType.toSleep:   //回到sleep 位置
                if (!this.sleepPos.equals(pos)) {
                    console.log("====isBackToSleepPos====")
                    this.monsterAnimation.play("WalkClip");
                    this.node.scaleX = this.sleepPos.x < pos.x ? -1 : 1;
                    let personPos = this.personNode.convertToWorldSpace(cc.Vec2.ZERO);
                    let selfPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);
                    let dist = Math.abs(personPos.x - selfPos.x);
                    let time = 3 * (dist / 500);
                    time = time > 3 ? 3 : time;
                    time = time < 2 ? 2 : time;
                    let action = cc.moveTo(time, this.sleepPos);

                    this.node.runAction(cc.sequence(
                        action,
                        cc.callFunc(() => {
                            if (this.monsterActionState == monsterActionType.toSleep) {
                                console.log("====to SleepPos====")
                                this.reduceState();
                            }
                        })
                    ));
                } else {
                    this.reduceState();
                }

                break;
            case monsterActionType.warning: //慢慢靠近人

                if (!this.isSafePos) { //靠近 非安全区的人 
                    this.monsterAnimation.play("WalkClip");

                } else {
                    //若人进入了安全区
                    this.reduceState();
                }

                break;
            case monsterActionType.attack:
                if (!this.isSafePos) {
                    if (!this.isAttack) {
                        this.isAttack = true;
                        let personPos = this.personNode.convertToWorldSpace(cc.Vec2.ZERO);
                        let selfPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);
                        let dist = toolsBasics.distanceVector(selfPos, personPos);
                        let time = 1 * (dist / 400);
                        time = time > 1 ? 1 : time;
                        time = time < 0.5 ? 0.5 : time;
                        let height = 200 * (dist / 400);
                        height = height > 300 ? 200 : height;
                        height = height < 100 ? 100 : height;
                        this.node.scaleX = personPos.x < selfPos.x ? -1 : 1;

                        let pos = this.node.position;
                        let tmpX = personPos.x - selfPos.x;
                        let jumpPos = cc.v2(pos.x + tmpX, pos.y - (selfPos.y - personPos.y));

                        this.monsterAnimation.play("ReadyAttackClip");
                        this.audioManager.playAudio("tigerAttack")
                        this.isDoAction = true;
                        let action1 = cc.jumpTo(time, jumpPos, height, 1);
                        let callfun = cc.callFunc(() => {
                            this.isAttack = false;
                            this.isDoAction = false;
                            if (this.monsterActionState == monsterActionType.attack) {
                                this.reduceState();
                            }
                        })
                        this.node.runAction(cc.sequence(action1, callfun));
                    }
                } else {
                    this.isAttack = false;
                    this.isDoAction = false;
                    this.reduceState();
                }

                break;
            default:
                break;
        }

    }

    //获取人物的状态
    getPersonAction() {
        // 每*秒 获取一次人物状态 , 若是重度动作, 则状态逐渐升级
        this.personNode.emit(setting.gameEvent.getBrotherAction, "", (action) => { //获取的当前人物动作
            if (action != personActionType.QuietlyWalk) {
                this.risingSate();
            } else {
                this.reduceState();
            }

        })
    }

    //根据当前状态 升级 每次状态改变
    risingSate() {


        if (this.monsterActionState == monsterActionType.sleep) {
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.standUp;
            this.isLoopAction = false;

        } else if (this.monsterActionState == monsterActionType.standUp) {
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.wait;

        } else if (this.monsterActionState == monsterActionType.wait) { //Wait
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.warning;

        } else if (this.monsterActionState == monsterActionType.warning) {
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.attack;

        } else if (this.monsterActionState == monsterActionType.toSleep) {
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.warning;

        } else if (this.monsterActionState == monsterActionType.lieDown) {
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.standUp;

        }

        console.log("==========升级======= monsterActionState+" + this.monsterActionState + "      preActionState= " + this.preActionState)
        //根据当前状态 做出相应的动作
        this.doOnceAction();
    }

    //降低 警戒值(状态)
    reduceState() {
        if (this.monsterActionState == monsterActionType.sleep) return;


        if (this.monsterActionState == monsterActionType.attack) {
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.toSleep;

        } else if (this.monsterActionState == monsterActionType.toSleep) {
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.wait;

        } else if (this.monsterActionState == monsterActionType.wait) { //Wait
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.lieDown;

        } else if (this.monsterActionState == monsterActionType.lieDown) {
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.sleep;
            this.isDoAction = false;

        } else if (this.monsterActionState == monsterActionType.warning) {
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.toSleep;

        } else if (this.monsterActionState == monsterActionType.standUp) {
            this.preActionState = this.monsterActionState;
            this.monsterActionState = monsterActionType.lieDown;

        }
        console.log("==========降级======= monsterActionState+" + this.monsterActionState)

        //根据当前状态 做出相应的动作
        this.doOnceAction();
    }

    //------------------event-----由外部调用--------------------------------- 
    setIsSafePos(isSafe) {
        this.isSafePos = isSafe;
        // console.log("=====isSafePos== " + this.isSafePos)
    }

    stopPlayAction(isPlay) {

        this.isDoAction = false;
        switch (this.monsterActionState) { //当前状态
            case monsterActionType.attack:
                this.isAttack = false;
                this.isDoAction = false;
                this.reduceState();
                break;
            case monsterActionType.standUp:
                this.risingSate();

                break;
            case monsterActionType.lieDown:
                this.reduceState();
                break;
            default:
                break;
        }
    }


    onCollisionEnter(other, self) {
        // console.log("===other.node.groupIndex===" + other.node.groupIndex)
        if (other.node.groupIndex == 6 && this.isAttack) {//人 
            this.canvas.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.REBORN)
        }
    }


}

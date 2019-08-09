
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import toolsBasics from "../../Tools/toolsBasics";

//狮子状态
const monsterActionType = cc.Enum({
    sleep: 0,
    walk: 1,
    warning: 2, //警戒
    attack: 3  //攻击
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

    sleepPos: cc.Vec2 = null;
    isPersonDeath: boolean = false;
    //人物当前动作状态
    personCurrAction = personActionType.Wait;
    //人物先前动作状态
    personPreAction = personActionType.QuietlyWalk;

    personPrePos: cc.Vec2 = null;
    //狮子是否是在观察中
    isObserve: boolean = false;
    //人物是否处于安全状态
    isSafePos: boolean = false;

    //是否处于降低状态中
    isReduceState: boolean = false;
    isWarning: boolean = false;
    isAttack: boolean = false;
    isBackToSleepPos: boolean = false;
    isSnoring: boolean = false;
    isSleeping: boolean = false;
    isPlayWaringAudio: boolean = false;

    audioManager = toolsBasics.getAudioManager();
    sleepAudioID: number = 0;
    warnAudioID: number = 0;

    isDoAction: boolean = false;

    //动作间隔
    actionTime = 2;

    start() {
        this.canvas = cc.find("Canvas");
        this.monsterAnimation = this.monsterNode.getComponent(cc.Animation);
        this.node.on(setting.gameEvent.leopardAction, this.setAction, this);
        this.node.on(setting.gameEvent.leopardReduceState, this.setIsSafePos, this);

        this.sleepPos = this.sleepPosNode.position;

    }


    update(dt) {
        this.isPersonDeath = setting.game.State == setting.setting.stateType.REBORN;
        //人没有死亡时 
        if (!this.isPersonDeath && this.personNode.hasEventListener(setting.gameEvent.getBrotherAction)) {

            //人处于安全状态时
            if (this.isSafePos) {
                if (!this.isReduceState) {
                    this.isReduceState = true;
                    this.scheduleOnce(() => { this.reduceState(); }, 2)
                }
            } else {
                //非攻击状态下 且 人处于非安全地方  
                if (!this.isDoAction && this.monsterActionState != monsterActionType.attack) {
                    //获取人物的状态
                    this.getPersonAction();
                }
            }

        } else {
            //人物死亡时 逐渐降低 状态
            if (!this.isReduceState) {
                this.isReduceState = true;
                this.scheduleOnce(() => { this.reduceState(); }, 2)
            }
        }

        //豹子 根据当前状态 做出相应的动作
        this.doAction(dt);

    }

    doAction(dt) {

        switch (this.monsterActionState) {
            case monsterActionType.sleep:
                if (!this.isSleeping) {
                    if (!this.isSnoring) {
                        this.isSnoring = true;
                        this.scheduleOnce(() => {
                            this.sleepAudioID = this.audioManager.playAudio("tigerSnoring") //鼾声
                            this.scheduleOnce(() => { this.isSnoring = false; }, 2);
                        }, 3)
                    }
                }
                break;
            case monsterActionType.walk:
                let pos = this.node.position;
                if (pos != this.sleepPos) { //回到sleep 位置
                    if (!this.isBackToSleepPos) {
                        this.isBackToSleepPos = true;
                        this.monsterAnimation.play("WalkClip");

                        console.log("====isBackToSleepPos====")

                        let dist = toolsBasics.distanceVector(pos, this.sleepPos);
                        let time = 3 * (dist / 500);
                        time = time > 3 ? 3 : time;
                        time = time < 1 ? 1 : time;

                        let selfPos = this.node.position;
                        this.node.scaleX = this.sleepPos.x < selfPos.x ? -1 : 1;

                        let action = cc.moveTo(time, this.sleepPos);
                        this.node.runAction(cc.sequence(
                            action,
                            cc.callFunc(() => {
                                this.isDoAction = false;
                            })
                        ));
                    }
                } else {
                    this.isBackToSleepPos = false;
                }
                break;
            case monsterActionType.warning:

                let personPos = this.personNode.convertToWorldSpace(cc.Vec2.ZERO);
                let selfPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);
                let dist = toolsBasics.distanceVector(personPos, selfPos);
                let speed = personPos.x > selfPos.x ? 1 : -1;

                if (!this.isWarning) { //发出heartBeat声音
                    this.isWarning = true;
                    if (!this.isPlayWaringAudio) {
                        this.isPlayWaringAudio = true;
                        this.schedule(() => {
                            this.isPlayWaringAudio = false;
                            this.warnAudioID = this.audioManager.playAudio("heartBeat");
                        }, 1, 1, 0)
                    }

                    this.node.scaleX = personPos.x >= selfPos.x ? 1 : -1;
                }

                if (!this.isSafePos) { //靠近person
                    if (dist > 100) {
                        let pos = this.node.position;
                        let action = cc.moveTo(dt, cc.v2(pos.x + speed, pos.y));
                        this.isDoAction = true;

                        this.node.runAction(cc.sequence(
                            action,
                            cc.callFunc(() => {
                                this.isDoAction = false;
                            })
                        ));
                    }
                }


                break;
            case monsterActionType.attack:
                if (!this.isAttack && !this.isSafePos) {
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

                    // console.log("======jump===" + height + "  time:" + time + "  jumpPos: " + jumpPos)
                    this.monsterAnimation.play("ReadyAttackClip");
                    this.audioManager.playAudio("tigerAttack")

                    let action1 = cc.jumpTo(time, jumpPos, height, 1);
                    // let action2 = cc.moveTo(time, cc.v2(pos.x, pos.y - (selfPos.y - personPos.y)));
                    this.isDoAction = true;
                    let callBack = cc.callFunc(() => {
                        this.isAttack = false;
                        this.isReduceState = true;
                        this.reduceState();
                        this.isDoAction = false;

                        console.log("=====jump End=====")
                    })
                    this.node.runAction(cc.sequence(action1
                        // cc.spawn(action1, action2)
                        , callBack));

                }

                break;
            default:
                break;
        }
        if (this.monsterActionState != monsterActionType.warning) {
            this.isWarning = false;
        }

        if (this.monsterActionState != monsterActionType.walk) {
            this.isBackToSleepPos = false;
        }

        if (this.monsterActionState != monsterActionType.sleep) {
            this.isSleeping = false;
        }
    }

    //获取人物的状态
    getPersonAction() {
        if (this.isObserve) return;

        this.personNode.emit(setting.gameEvent.getBrotherAction, "", (order: { direction: number, action: number, msg?: any }) => {
            let personAction = order.action;
            // 当人物 不是 (QuietlyWalk)悄悄走的状态 若2秒之后人物还是此状态 则豹子进入 警戒状态(warning)
            if (personAction != personActionType.QuietlyWalk) {
                this.personPreAction = personAction;
                //2 秒后再次获取人物状态
                this.isObserve = true;

                //设置当前状态 升级所需的时间
                switch (this.monsterActionState) {
                    case monsterActionType.sleep:
                        this.actionTime = 2;
                        break;
                    case monsterActionType.walk:
                        this.actionTime = 2;
                        break;
                    case monsterActionType.warning:
                        this.actionTime = 3;
                        break;

                    default:
                        break;
                }

                this.scheduleOnce(() => {
                    // console.log("======2 S 后===========");

                    this.isObserve = false;

                    this.personNode.emit(setting.gameEvent.getBrotherAction, "", (order: { direction: number, action: number, msg?: any }) => {
                        this.personCurrAction = order.action;

                        if (this.monsterActionState == monsterActionType.sleep) {
                            //狮子是 sleep -0
                            if (this.personCurrAction != personActionType.QuietlyWalk) {
                                //检测人物 仍然是重度活动状态 则进入 walk 状态
                                this.monsterActionState = monsterActionType.walk;
                            } else {
                                //否则 继续 sleep 
                                this.monsterActionState = monsterActionType.sleep;
                                //继续观察
                                this.personPreAction = this.personCurrAction;
                            }
                        } else if (this.monsterActionState == monsterActionType.walk) {
                            //狮子是 walk状态 -1
                            if (this.personCurrAction != personActionType.QuietlyWalk) {
                                //检测人物 仍然是重度活动状态 则进入 warning 状态
                                this.monsterActionState = monsterActionType.warning;
                            } else {
                                //否则 进入 sleep 
                                this.monsterActionState = monsterActionType.sleep;
                                //继续观察
                                this.personPreAction = this.personCurrAction;
                            }
                        } else if (this.monsterActionState == monsterActionType.warning) {
                            //狮子是 warning状态 -2
                            if (this.personCurrAction != personActionType.QuietlyWalk) {
                                //检测人物 仍然是重度活动状态 则进入 attack 状态
                                this.monsterActionState = monsterActionType.attack;
                            } else {
                                //否则 进入 walk 
                                this.monsterActionState = monsterActionType.walk;
                                //继续观察
                                this.personPreAction = this.personCurrAction;
                            }
                        }

                        console.log("==========Add======= monsterActionState+" + this.monsterActionState)
                    });

                }, this.actionTime)

            }

        })
    }

    //降低 警戒值(状态)
    reduceState() {
        this.isReduceState = false;
        if (this.monsterActionState == monsterActionType.sleep) {
            //狮子是 sleep -0
            return;
        }
        // this.scheduleOnce(() => {
        if (this.monsterActionState == monsterActionType.walk) {
            //狮子是 walk状态 -1
            this.monsterActionState = monsterActionType.sleep;

        } else if (this.monsterActionState == monsterActionType.warning) {
            //否则 进入 walk 
            this.monsterActionState = monsterActionType.walk;

        } else if (this.monsterActionState == monsterActionType.attack) {
            //否则 进入 walk 
            this.monsterActionState = monsterActionType.walk;
        }
        console.log("==========reduceState======= monsterActionState+" + this.monsterActionState)
        // }, this.actionTime);



    }

    //更改状态 状态变化 sleep -> walk -> warning -> attack
    setAction(action): boolean {
        //只能从 walk -> sleep 
        if (this.monsterActionState == monsterActionType.walk && action == monsterActionType.sleep) {
            this.monsterActionState = action;
            return true;
        }
        //可以从 (sleep,warning,attack) -> walk
        if (action == monsterActionType.walk) {
            this.monsterActionState = action;
            return true;
        }
        //只能从 (walk,attack) -> warning
        if ((this.monsterActionState == monsterActionType.warning || this.monsterActionState == monsterActionType.attack)
            && action == monsterActionType.warning) {
            this.monsterActionState = action;
            return true;
        }
        //只能从 (warning) -> attack
        if (this.monsterActionState == monsterActionType.warning && action == monsterActionType.attack) {
            this.monsterActionState = action;
            return true;
        }

        return false;
    }

    setIsSafePos(isSafe) {
        this.isSafePos = isSafe;
        console.log("=====isSafePos== " + this.isSafePos)
    }


    onCollisionEnter(other, self) {
        console.log("===other.node.groupIndex===" + other.node.groupIndex)
        if (other.node.groupIndex == 6 && this.isAttack) {//人 
            this.canvas.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.REBORN)
        }
    }


}


const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import toolsBasics from "../../Tools/toolsBasics";

//狮子状态
const leopardActionType = cc.Enum({
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

    leopardActionState = leopardActionType.sleep;

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

    //X轴向右移动的最大距离
    maxDistanceX: number = 0;
    //动作切换延迟
    actionTime: number = 2;

    audioSorce = toolsBasics.getAudioManager();
    warningAudioID: number = 0;

    start() {
        this.node.on(setting.gameEvent.leopardAction, this.setAction, this);
        this.node.on(setting.gameEvent.leopardReduceState, this.setIsSafePos, this);

        this.sleepPos = this.node.position;
        this.maxDistanceX = this.sleepPos.x + 600;

        //test
        this.scheduleOnce(() => {
            this.leopardActionState = leopardActionType.attack;
            console.log("==attack===")
        }, 2)
    }


    update(dt) {
        this.isPersonDeath = setting.game.State == setting.setting.stateType.REBORN;
        //人没有死亡时 
        if (!this.isPersonDeath && this.personNode.hasEventListener(setting.gameEvent.getBrotherAction)) {
            //非攻击状态下 且 人处于非安全地方时
            if (this.leopardActionState != leopardActionType.attack && !this.isSafePos) {
                //获取人物的状态
                this.getPersonAction();
            }
            //人处于安全状态时
            if (this.isSafePos) {
                this.reduceState();
            }

        } else {
            //人物死亡时 逐渐降低 状态
            this.reduceState();
        }

        //豹子 根据当前状态 做出相应的动作
        this.doAction(dt);

    }

    doAction(dt) {
        switch (this.leopardActionState) {
            case leopardActionType.sleep:

                break;
            case leopardActionType.walk:
                let pos = this.node.position;
                if (pos.x <= this.sleepPos.x) {
                    this.node.scaleX = 1;
                    this.node.runAction(cc.moveTo(dt, cc.v2(pos.x + 2, pos.y)))
                }
                if (pos.x >= this.maxDistanceX) {
                    this.node.scaleX = -1;
                    this.node.runAction(cc.moveTo(dt, cc.v2(pos.x - 2, pos.y)))
                }
                break;
            case leopardActionType.warning:
                if (!this.isWarning) {
                    this.isWarning = true;
                    this.warningAudioID = this.audioSorce.playAudio("heartBeat");
                }
                break;
            case leopardActionType.attack:
                if (!this.isAttack) {
                    this.isAttack = true;
                    let personPos = this.personNode.convertToWorldSpace(cc.Vec2.ZERO);
                    let selfPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);
                    let dist = toolsBasics.distanceVector(selfPos, personPos);
                    let time = 1 * (dist / 300);
                    time = time > 1 ? 1 : time;
                    time = time < 0.5 ? 0.5 : time;
                    let height = 200 * (dist / 300);
                    height = height > 300 ? 200 : height;
                    height = height < 100 ? 100 : height;
                    this.node.scaleX = personPos.x < selfPos.x ? -1 : 1;

                    let jumpPos = cc.v2(this.node.scaleX > 0 ? personPos.x + 200 : personPos.x - 200, personPos.y);
                    jumpPos = this.node.parent.convertToNodeSpaceAR(cc.v2(personPos.x, personPos.y));
                    // console.log("======jump===" + height + "  time:" + time+"  personPos: "+personPos)
                    let action = cc.jumpTo(0.5, jumpPos,500, 1);
                    this.node.runAction(cc.sequence(
                        action,
                        cc.callFunc(() => {
                            this.isAttack = false;
                            this.reduceState();
                        })
                    ));

                }

                break;
            default:
                break;
        }
        if (this.leopardActionState != leopardActionType.warning) {
            this.audioSorce.stopAudioById(this.warningAudioID);
        }

    }

    //获取人物的状态
    getPersonAction() {
        if (this.isObserve) return;

        this.personNode.emit(setting.gameEvent.getBrotherAction, "", (order: { direction: number, action: number, msg?: any }) => {
            let personAction = order.action;
            // 当人物 不是 (QuietlyWalk)悄悄走的状态 若1.5秒之后人物还是此状态 则豹子进入 警戒状态(warning)
            if (personAction != personActionType.QuietlyWalk) {
                this.personPreAction = personAction;
                //1.5秒后再次获取人物状态
                this.isObserve = true;
                this.scheduleOnce(() => {
                    // console.log("======1.5 S 后===========");

                    this.isObserve = false;

                    this.personNode.emit(setting.gameEvent.getBrotherAction, "", (order: { direction: number, action: number, msg?: any }) => {
                        this.personCurrAction = order.action;

                        if (this.leopardActionState == leopardActionType.sleep) {
                            //狮子是 sleep -0
                            if (this.personCurrAction != personActionType.QuietlyWalk) {
                                //检测人物 仍然是重度活动状态 则进入 walk 状态
                                this.leopardActionState = leopardActionType.walk;
                            } else {
                                //否则 继续 sleep 
                                this.leopardActionState = leopardActionType.sleep;
                                //继续观察
                                this.personPreAction = this.personCurrAction;
                            }
                        } else if (this.leopardActionState == leopardActionType.walk) {
                            //狮子是 walk状态 -1
                            if (this.personCurrAction != personActionType.QuietlyWalk) {
                                //检测人物 仍然是重度活动状态 则进入 warning 状态
                                this.leopardActionState = leopardActionType.warning;
                            } else {
                                //否则 进入 sleep 
                                this.leopardActionState = leopardActionType.sleep;
                                //继续观察
                                this.personPreAction = this.personCurrAction;
                            }
                        } else if (this.leopardActionState == leopardActionType.warning) {
                            //狮子是 warning状态 -2
                            if (this.personCurrAction != personActionType.QuietlyWalk) {
                                //检测人物 仍然是重度活动状态 则进入 attack 状态
                                this.leopardActionState = leopardActionType.attack;
                            } else {
                                //否则 进入 walk 
                                this.leopardActionState = leopardActionType.walk;
                                //继续观察
                                this.personPreAction = this.personCurrAction;
                            }
                        }

                        console.log("==========Add======= leopardActionState+" + this.leopardActionState)
                    });

                }, 1.5)

            }

        })
    }

    //降低 警戒值(状态)
    reduceState() {

        if (this.leopardActionState == leopardActionType.sleep || this.isReduceState) {
            //狮子是 sleep -0
            return;
        }
        this.isReduceState = true;

        // this.scheduleOnce(() => {
        this.isReduceState = false;

        if (this.leopardActionState == leopardActionType.walk) {
            //狮子是 walk状态 -1
            this.leopardActionState = leopardActionType.sleep;

        } else if (this.leopardActionState == leopardActionType.warning) {
            //否则 进入 walk 
            this.leopardActionState = leopardActionType.walk;
            this.actionTime = 4;
        } else if (this.leopardActionState == leopardActionType.attack) {
            //否则 进入 walk 
            this.leopardActionState = leopardActionType.warning;
        }
        console.log("==========reduceState======= leopardActionState+" + this.leopardActionState)
        // }, this.actionTime);



    }

    //更改状态 状态变化 sleep -> walk -> warning -> attack
    setAction(action): boolean {
        //只能从 walk -> sleep 
        if (this.leopardActionState == leopardActionType.walk && action == leopardActionType.sleep) {
            this.leopardActionState = action;
            return true;
        }
        //可以从 (sleep,warning,attack) -> walk
        if (action == leopardActionType.walk) {
            this.leopardActionState = action;
            return true;
        }
        //只能从 (walk,attack) -> warning
        if ((this.leopardActionState == leopardActionType.warning || this.leopardActionState == leopardActionType.attack)
            && action == leopardActionType.warning) {
            this.leopardActionState = action;
            return true;
        }
        //只能从 (warning) -> attack
        if (this.leopardActionState == leopardActionType.warning && action == leopardActionType.attack) {
            this.leopardActionState = action;
            return true;
        }

        return false;
    }

    setIsSafePos(isSafe) {
        this.isSafePos = isSafe;
    }


}

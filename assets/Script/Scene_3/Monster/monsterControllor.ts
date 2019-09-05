
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import toolsBasics from "../../Tools/toolsBasics";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import settingBasic from "../../Setting/settingBasic";

//monster状态
const monsterActionType = cc.Enum({
    sleep: 0,
    standUp: 1,
    lieDown: 2, //过度 
    // toSleep: 3, //走回sleep 地点
    warning: 4, //靠近人
    attack: 5, //攻击
    wait: 6,
    jumpBack: 7,
})

//人物状态
const personActionType = setting.setting.actionType;

@ccclass
export default class LeopardControllor extends LogicBasicComponent {

    @property(cc.Node)
    personNode: cc.Node = null;
    @property(cc.Node)
    monsterNode: cc.Node = null;
    itemBag: cc.Node = null;

    monsterAnimation: cc.Animation = null;
    currScene: cc.Node = null;
    monsterActionState = monsterActionType.sleep;

    isPersonDeath: boolean = false;

    //monster是否是在观察中
    isObservePerson: boolean = false;
    //人物是否处于安全状态
    isSafePos: boolean = false;

    //是否处于降低状态中
    isReduceState: boolean = false;
    //是否已经发现人
    isDiscover: boolean = false;
    isAttack: boolean = false;
    isSnoring: boolean = false;
    isPlayWaringAudio: boolean = false;
    isJumpBack: boolean = false;

    audioManager = toolsBasics.getAudioManager();

    //是否处于播放动画 状态
    isDoAction: boolean = false;
    //是否处于循环Action状态
    isLoopAction: boolean = true;

    isMonsterActionStart: boolean = false;
    start() {
        this.itemBag = cc.find("UIMask/UICamera/itemsBag")
        this.currScene = cc.find("Canvas/" + settingBasic.game.currScene);
        this.monsterAnimation = this.monsterNode.getComponent(cc.Animation);
        this.node.on(setting.gameEvent.monsterReduceState, this.setIsSafePos, this);
        this.node.on(setting.gameEvent.monsterStopPlayAction, this.stopPlayAction, this);

        //初始化1S后启动
        this.scheduleOnce(() => { this.isMonsterActionStart = true; }, 1)
    }

    logicUpdate(dt) {
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

                if (!this.isObservePerson && this.isDoAction
                    && (this.monsterActionState == monsterActionType.sleep)
                ) {
                    this.isDoAction = false;
                }

                if (!this.isObservePerson && !this.isDoAction
                    && (this.monsterActionState == monsterActionType.sleep
                        || this.monsterActionState == monsterActionType.warning
                        || this.monsterActionState == monsterActionType.wait)
                ) {
                    this.isObservePerson = true;
                    let actionTime = 1.5;
                    if (this.monsterActionState == monsterActionType.wait) {
                        actionTime = 1;
                    }

                    this.scheduleOnce(() => {
                        // console.log("=======Observe Person====")
                        this.isObservePerson = false;
                        //获取人物的状态
                        this.getPersonAction();
                    }, actionTime)
                }
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
                        this.audioManager.playAudio("tigerSnoring") //鼾声
                        this.scheduleOnce(() => { this.isSnoring = false; }, 2);
                    }, 3)
                }

                break;
            case monsterActionType.warning:
                if (!this.isPlayWaringAudio) {
                    this.isPlayWaringAudio = true;
                    this.scheduleOnce(() => {
                        this.isPlayWaringAudio = false;
                        this.audioManager.playAudio("heartBeat");
                    }, 1)
                }

                let pos = this.node.position;
                if (!this.isSafePos) {  //靠近 非安全区的人 

                    let personPos = this.personNode.convertToWorldSpace(cc.Vec2.ZERO);
                    let selfPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);
                    let dist = personPos.x - selfPos.x;
                    let speed = personPos.x >= selfPos.x ? 2 : -2;

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
                // console.log("====  lieDown  ====")
                this.isDoAction = true;
                this.monsterAnimation.play("LieDownClip");

                break;

            case monsterActionType.warning: //慢慢靠近人

                if (!this.isSafePos) { //靠近 非安全区的人 
                    this.monsterAnimation.play("WalkClip");
                }

                break;
            case monsterActionType.attack:

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
                        this.reduceState();
                        this.currScene.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.REBORN);

                        this.currScene.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.RESTART);
                    })
                    this.node.runAction(cc.sequence(action1, callfun));
                }

                break;
            case monsterActionType.jumpBack:

                let pos = this.node.position;
                let tmpX = -500;
                let jumpPos = cc.v2(pos.x + tmpX, pos.y);

                this.monsterAnimation.play("ReadyAttackClip");
                this.isDoAction = true;

                let action1 = cc.jumpTo(0.5, jumpPos, 200, 1);
                let callfun = cc.callFunc(() => {
                    this.isDoAction = false;
                    this.monsterActionState = monsterActionType.wait;
                })
                this.node.runAction(cc.sequence(action1, callfun));


                break;
            default:
                break;
        }

    }

    //在非安全区域 获取人物的状态 
    getPersonAction() {
        // 每*秒 获取一次人物状态 , 若是重度动作, 则状态逐渐升级
        this.personNode.emit(setting.gameEvent.getBrotherAction, "", (action) => { //获取的当前人物动作

            if (this.isDiscover) { //已经发现人 只会升级状态
                this.risingSate();
            } else { // 没有发现人的情况下 根据人物当前的动作 改变状态
                if (action != personActionType.QuietlyWalk) {
                    this.risingSate();
                }
            }

        })
    }

    //根据当前状态 升级 每次状态改变 //非安全区域 才会提升警戒值
    risingSate(type?: number) {
        if (type) {
            this.monsterActionState = type;
        } else {
            if (this.monsterActionState == monsterActionType.sleep) {
                this.monsterActionState = monsterActionType.standUp;
                this.isLoopAction = false;

            } else if (this.monsterActionState == monsterActionType.standUp) {
                this.monsterActionState = monsterActionType.wait;

            } else if (this.monsterActionState == monsterActionType.wait) { //Wait
                this.monsterActionState = monsterActionType.warning;

            } else if (this.monsterActionState == monsterActionType.warning) {
                this.monsterActionState = monsterActionType.attack;

            } else if (this.monsterActionState == monsterActionType.warning) {
                this.monsterActionState = monsterActionType.attack;

            } else if (this.monsterActionState == monsterActionType.lieDown) {
                this.monsterActionState = monsterActionType.standUp;

            }
        }

        //根据当前状态 做出相应的动作
        this.doOnceAction();
    }

    //降低 警戒值(状态) 、//只有在安全区域 才会降低警戒值
    reduceState(type?: number) {
        if (type) {
            this.monsterActionState = type;
        } else {

            if (this.monsterActionState == monsterActionType.sleep) return;

            if (this.monsterActionState == monsterActionType.wait) { //Wait
                this.monsterActionState = monsterActionType.lieDown;

            } else if (this.monsterActionState == monsterActionType.lieDown) {
                this.monsterActionState = monsterActionType.sleep;
                this.isDoAction = false;

            } else if (this.monsterActionState == monsterActionType.warning) {
                this.monsterActionState = monsterActionType.wait;

            } else if (this.monsterActionState == monsterActionType.standUp) {
                this.monsterActionState = monsterActionType.lieDown;

            } else if (this.monsterActionState == monsterActionType.attack) {
                this.monsterActionState = monsterActionType.lieDown;

            }
        }

        //根据当前状态 做出相应的动作
        this.doOnceAction();
    }

    //------------------event-----由外部调用--------------------------------- 
    setIsSafePos(isSafe) {
        this.isSafePos = isSafe;

        //进入非安全区时 检测人物状态
        this.personNode.emit(setting.gameEvent.getBrotherAction, "", (action) => { //获取的当前人物动作
            this.isDiscover = action != personActionType.QuietlyWalk;
        })
        // console.log("=====isSafePos== " + this.isSafePos)
    }

    stopPlayAction(isPlay) {

        this.isDoAction = false;
        switch (this.monsterActionState) { //当前状态
            case monsterActionType.attack:
                this.isAttack = false;
                this.reduceState();
                break;
            case monsterActionType.standUp:
                this.reduceState(monsterActionType.wait)
                break;
            case monsterActionType.lieDown:
                this.reduceState();
                break;
            default:
                break;
        }
    }
    //跳开 躲避笼子
    jumpBack() {
        this.node.scaleX = -1;
        let pos = this.node.position;

        this.reduceState(monsterActionType.jumpBack);
        this.isJumpBack = false;
    }

    onCollisionEnter(other, self) {

        //碰到笼子边缘回跳 /碰到中间传感器 捕捉成功
        if (other.node.groupIndex == 18) {
            if (other.node.name == "sensorM") {
                this.isAttack = false;
                this.isDoAction = false;
                this.reduceState(monsterActionType.wait);
                this.isMonsterActionStart = false;

                this.itemBag.emit(setting.gameEvent.getItemEvent, setting.setting.itemType.tear, (isOver) => {
                    if (isOver) {
                        this.currScene.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.NEXT)
                    }
                });

                return
            } else {
                let body: cc.RigidBody = other.node.parent.getComponent(cc.RigidBody)
                let vy = body.linearVelocity.y;
                if (vy <= 10) {
                    if (!this.isJumpBack) {
                        this.isJumpBack = true;
                        this.jumpBack();
                    }
                }
            }
        }

    }


}

const { ccclass, property } = cc._decorator;
import tools from "../../Tools/toolsBasics";
import setting from "../../Setting/settingBasic";
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    river: cc.Node = null;
    @property(cc.Node)
    personNode: cc.Node = null;

    @property(cc.Node)
    attackNode: cc.Node = null;
    canvas: cc.Node = null;

    isStartSwim: boolean = false; //是否开始

    isAttack: boolean = false; //攻击状态
    isPreAttack: boolean = false; //预备攻击状态
    isObserve: boolean = true; //观察状态
    isPersonDeath: boolean = false;

    safeDistance: number = 500;

    prePersonPos: cc.Vec2 = null;    //观察前人的位置
    animation: cc.Animation = null;
    repeatActionTag: any = null;
    moveSpeed: number = 6;

    minX: number = 0;
    maxX: number = 0;
    audioManager = tools.getAudioManager();

    //
    lifeNum: number = 2;


    onLoad() {
        this.canvas = cc.find("Canvas");
        this.prePersonPos = this.personNode.position;
        this.animation = this.node.getComponent(cc.Animation);
        let riverPos = this.river.convertToWorldSpace(cc.Vec2.ZERO);

        this.minX = this.node.parent.convertToNodeSpaceAR(riverPos).x - this.node.width;
        this.maxX = this.minX + this.river.width;
    }

    start() {
        this.animation.on(cc.Animation.EventType.FINISHED, this.jumpFinished, this);
        this.animation.play("SwimClip");

        //游戏开始2秒之后再 执行
        this.scheduleOnce(() => { this.isStartSwim = true }, 1);
    }

    update(dt) {

        //检测是否人已经死亡
        this.isPersonDeath = setting.game.State == setting.setting.stateType.REBORN;

        if (!this.isAttack && !this.isPreAttack) {

            if (this.isObserve && this.isStartSwim) {
                this.isObserve = false;

                this.scheduleOnce(() => { this.observePerson(); }, 2);
            }

            //左右游动
            let pos = this.node.position;
            let speed = this.moveSpeed;
            if (this.node.x < this.minX) {
                this.node.scaleX = 1;
            } else if (this.node.x > this.maxX) {
                this.node.scaleX = -1;
            }
            speed = this.node.scaleX > 0 ? this.moveSpeed : -this.moveSpeed;

            this.node.runAction(cc.moveTo(dt, cc.v2(pos.x + speed, pos.y)))
        }



    }

    observePerson() {

        //2秒后再次观察人物的位置， 两次位置 若没有变化则准备攻击
        let personPos = this.personNode.position;
        if (this.prePersonPos.fuzzyEquals(personPos, 5) && !this.isPersonDeath) {
            //进入预备攻击状态
            let personPos = this.personNode.convertToWorldSpace(cc.Vec2.ZERO);
            let fishPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);
            let dist = tools.distanceVector(fishPos, personPos) - 200; //绝对值

            if (!this.isPreAttack) {
                // console.log("============isPreAttack== dist =" + dist)
                this.isPreAttack = true;

                let time = dist / this.safeDistance * 1;
                time = time <= 0.5 ? 0.5 : time;
                time = time >= 4 ? 4 : time;

                this.animation.play("SwimClip");
                this.node.scaleX = personPos.x >= fishPos.x ? 1 : -1;
                let pos = this.node.parent.convertToNodeSpaceAR(personPos);
                pos = cc.v2(this.node.scaleX > 0 ? pos.x - 200 : pos.x + 200, pos.y)

                //靠近
                let moveAction = cc.moveTo(time, cc.v2(pos.x, this.node.y));
                let downAction = cc.moveTo(0.3, cc.v2(pos.x, this.node.y - 50));
                let rotaAction = cc.rotateBy(0.3, this.node.scaleX < 0 ? 20 : -20); //起跳
                let warnId = 0;
                this.node.runAction(cc.sequence(
                    //警告声音
                    cc.callFunc(() => {
                        warnId = this.audioManager.playAudio("fishWarning");
                    }),
                    moveAction,
                    cc.spawn(downAction, rotaAction),
                    cc.callFunc(() => {
                        if (!this.isAttack) {

                            this.isPreAttack = false;
                            this.isAttack = true;
                            //发动攻击
                            this.animation.play("JumpClip");
                            let tmpDist = this.node.scaleX < 0 ? -200 : 200;
                            let height = personPos.y - fishPos.y - 120;
                            let time = height / 200 * 0.5;
                            time = time <= 0.5 ? 0.5 : time;
                            time = time >= 1.5 ? 1.5 : time;
                            let jumpAction = cc.jumpTo(time, cc.v2(this.node.x + tmpDist, this.node.y + 50), height, 1)
                            let rotaAction1 = cc.rotateBy(time / 2, this.node.scaleX < 0 ? 50 : -50);
                            let rotaAction2 = cc.rotateBy(time / 2, this.node.scaleX < 0 ? -70 : 70);
                            this.node.runAction(
                                cc.sequence(
                                    //跳跃前
                                    cc.callFunc(() => {
                                        this.audioManager.stopEffectByID(warnId);
                                        this.audioManager.playAudio("outWater")
                                    }),
                                    cc.spawn(jumpAction, cc.sequence(rotaAction1, rotaAction2)),
                                    //跳跃后
                                    cc.callFunc(() => {
                                        this.audioManager.playAudio("fallIntoWater");
                                        
                                    }),
                                )
                            )
                        }
                    })
                ));

            }
        } else {
            this.isObserve = true; //继续观察
            this.prePersonPos = personPos; //记录人物位置
        }
    }




    jumpFinished() {
        if (this.isAttack) { //(攻击)跳跃动作时
            this.isAttack = false;
            this.isPreAttack = false;
            this.isObserve = true; //继续观察
            this.animation.play("SwimClip");

        }
    }

    onBeginContact(contact, self, other) {
        if (other.node.groupIndex == 6 && !this.isPersonDeath) {
            //检测是否碰撞到人-6
            this.canvas.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.REBORN);
            this.isPersonDeath = true;

        }

        //碰到下落的石头-12 
        if (other.node.groupIndex == 12) {
            console.log("=======fish==stone======")
            let stone: cc.Node = other.node;
            let vy = stone.getComponent(cc.RigidBody).linearVelocity.y;
            if (vy < -10) {
                this.lifeNum--;
                if (this.lifeNum == 0) {
                    //下一关
                    this.canvas.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.NEXT)
                }
            }
        }
    }

}

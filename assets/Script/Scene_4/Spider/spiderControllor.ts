const { ccclass, property } = cc._decorator;
import tools from "../../Tools/toolsBasics";
import setting from "../../Setting/settingBasic";
import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import audioControllor from "../../Common/Audio/audioControllor";
import audioSetting from "../../Common/Audio/audioSetting";

const spiderActionType = cc.Enum({
    wait: 0,
    walk: 1,
    attack: 2,
    rotation: 3, //翻转到正面
})

const moveStep = cc.Enum({
    zeroth: 0,
    first: 1,
    secend: 2,
    third: 3,
    fourth: 4
})
//爬行动画
const autoAnimType = cc.Enum({
    zeroth: 0,
    first: 1,
    secend: 2,
})

@ccclass
export default class spiderClass extends LogicBasicComponent {

    @property(cc.Node)
    spider: cc.Node = null;
    @property(cc.Node)
    person: cc.Node = null;

    spiderAnimation: cc.Animation = null;
    currStep: number = moveStep.zeroth;
    currAction: number = spiderActionType.wait; //当前蜘蛛的动作
    audioManager: audioControllor = null;
    walkAudioID = 0;

    isPersonDeath: boolean = false;
    isPlayAnimation: boolean = false; //是否是在播放动画

    body: cc.RigidBody = null;
    phyBody: cc.PhysicsPolygonCollider = null;

    speed: number = 2;
    isStart: boolean = false;
    currScene: cc.Node = null;
    scaleX: number = 1;

    //
    isOnGround = false;
    start() {

        this.audioManager = cc.find("UICamera/audio").getComponent("audioControllor");
        this.currScene = cc.find("Canvas" + settingBasic.game.currScene);
        this.spiderAnimation = this.spider.getComponent(cc.Animation)
        this.body = this.node.getComponent(cc.RigidBody)
        this.phyBody = this.node.getComponent(cc.PhysicsPolygonCollider)
        this.scaleX = this.node.scaleX;
    }

    logicUpdate(dt) {
        if (!this.isStart) return

        this.moveByAction(dt);
    }
    //一直执行
    moveByAction(dt) {
        switch (this.currAction) {
            case spiderActionType.wait:

                break;
            case spiderActionType.walk:
                if (!this.isOnGround) {
                    let worldPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);
                    let personPos = this.person.convertToWorldSpace(cc.Vec2.ZERO);

                    this.node.scaleX = worldPos.x > personPos.x ? -this.scaleX : this.scaleX;
                    let pos = this.node.position;

                    let dis = tools.distanceVector(worldPos, personPos)
                    let tmpX = worldPos.x > personPos.x ? -this.speed : this.speed;
                    if (dis > 600) {
                        tmpX = worldPos.x > personPos.x ? -this.speed : this.speed;
                    }

                    if (dis > 300) {
                        this.node.runAction(cc.moveTo(dt, cc.v2(pos.x + tmpX, pos.y)))
                    } else {
                        this.doAction(spiderActionType.attack);
                    }
                } else {
                    //在底下行走 速度加快
                    let pos = this.node.position;
                    this.node.runAction(cc.moveTo(dt, cc.v2(pos.x + this.speed, pos.y)))
                }
                break;
            case spiderActionType.attack:

                break;
            default:
                break;
        }
    };

    //只执行一次
    doAction(action: number) {
        switch (action) {
            case spiderActionType.rotation: //翻身
                this.audioManager.stopAudioById(this.walkAudioID);
                this.spiderAnimation.play("WaitClip")
                cc.tween(this.node).to(2, { angle: 0 })
                    .call(() => {
                        this.doAction(spiderActionType.walk);
                    }).start()

                break;
            case spiderActionType.wait:
                this.spiderAnimation.play("WaitClip")
                this.audioManager.stopAudioById(this.walkAudioID);
                break;
            case spiderActionType.walk:
                this.spiderAnimation.play("WalkClip")
                this.walkAudioID = this.audioManager.playAudio(audioSetting.other.lv4.spider.walk, true, 0.6, 0.05, this.node, true);

                break;
            case spiderActionType.attack:
                this.spiderAnimation.play("AttackClip")
                this.audioManager.stopAudioById(this.walkAudioID);
                this.audioManager.playAudio(audioSetting.other.lv4.spider.attack)

                cc.tween(this.node).delay(3).call(() => {
                    this.doAction(spiderActionType.walk);
                }).start()
                break;
            default:
                break;
        }
        this.currAction = action;
    }

    public isAttack(): boolean {
        return this.currAction == spiderActionType.attack;
    }

    //用于Sensor调用 控制运动步骤
    public nexSetp() {
        switch (this.currStep) {
            case moveStep.zeroth:
                let pos = this.node.position;

                cc.tween(this.node).to(1, { position: cc.v2(pos.x, pos.y - 250) }, { easing: "backInOut" }).delay(0.5)
                    .to(1, { position: cc.v2(pos.x, pos.y - 500) }, { easing: "backInOut" }).delay(0.6).call(() => {
                        this.isStart = true;
                        this.body.type = cc.RigidBodyType.Dynamic;
                        this.phyBody.apply();
                    }).start();
                break;
            case moveStep.secend:
                break;
            default:
                break;
        }
    }

    //播放向上爬行动画
    public playAutoAnimation(type: number) {
        if (this.isPlayAnimation) return
        this.isPlayAnimation = true;

        let pos = this.node.position;
        switch (type) {
            case autoAnimType.zeroth: //爬下
                this.body.type = cc.RigidBodyType.Static;
                this.phyBody.apply();

                cc.tween(this.node).to(1, { angle: -40, x: pos.x + 100 })
                    .to(3, { position: cc.v2(pos.x + 150, pos.y - 100) })
                    .to(2, { angle: 0, x: pos.x + 200 }).call(() => {
                        this.body.type = cc.RigidBodyType.Dynamic;
                        this.phyBody.apply();
                        this.isPlayAnimation = false;
                    }).start();
                break;
            case autoAnimType.first: //爬行第一段
                this.body.type = cc.RigidBodyType.Static;
                this.phyBody.apply();

                cc.tween(this.node).to(1, { angle: 40, x: pos.x + 100 })
                    .to(3, { position: cc.v2(pos.x + 300, pos.y + 252) })
                    .to(2, { angle: 0, x: pos.x + 400 }).call(() => {
                        this.body.type = cc.RigidBodyType.Dynamic;
                        this.phyBody.apply();
                        this.isPlayAnimation = false;
                    }).start();

                break;
            case autoAnimType.secend://爬行第二段
                this.body.type = cc.RigidBodyType.Static;
                this.phyBody.apply();
                cc.tween(this.node).to(0.5, { angle: 40, x: pos.x + 50 })
                    .to(2, { position: cc.v2(pos.x + 150, pos.y + 253) })
                    .to(1, { angle: 0, x: pos.x + 300 }).call(() => {
                        this.body.type = cc.RigidBodyType.Dynamic;
                        this.phyBody.apply();
                        this.isPlayAnimation = false;
                    }).start();

                break;
            default:
                break;
        }
    }

    //在产生物理碰撞效果前
    onPreSolve(contact, self, other) {
        //对人不产生物理效果
        if (other.node.groupIndex == 6) {
            contact.disabled = true;
        }
    }
    //在产生物理碰撞效果开始
    onBeginContact(contact, self, other) {
        //接触地面 play walk
        if (other.node.groupIndex == 4 || other.node.groupIndex == 20) {
            if (this.currAction == spiderActionType.wait) {
                cc.tween(this.node).call(() => {
                    this.doAction(spiderActionType.wait);
                }).delay(1).call(() => {
                    this.doAction(spiderActionType.walk);
                }).start();
            }
        }
        if (other.node.groupIndex == 20) {
            this.isOnGround = true;
            this.speed = 3;
        }

        //被石头砸中
        if (other.node.groupIndex == 12) {
            let body: cc.RigidBody = other.node.getComponent(cc.RigidBody)
            let vy = body.linearVelocity.y;
            if (vy <= -100) {
                this.currScene.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.NEXT);
                this.isStart = false;
            }
        }

    }
    //在产生物理碰撞效果结束
    onEndContact(contact, self, other) {
        if (other.node.groupIndex == 20) {
            this.isOnGround = false;
            this.speed = 2;
        }
    }
}

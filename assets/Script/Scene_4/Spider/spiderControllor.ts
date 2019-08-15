const { ccclass, property } = cc._decorator;
import tools from "../../Tools/toolsBasics";
import setting from "../../Setting/settingBasic";

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
@ccclass
export default class spiderClass extends cc.Component {

    @property(cc.Node)
    spider: cc.Node = null;
    spiderAnimation: cc.Animation = null;
    currStep: number = moveStep.zeroth;
    currAction: number = spiderActionType.wait; //当前蜘蛛的动作

    @property(cc.Node)
    person: cc.Node = null;

    isPersonDeath: boolean = false;

    body: cc.RigidBody = null;
    phyBody: cc.PhysicsPolygonCollider = null;
    isStart: boolean = false;
    canvas: cc.Node = null;
    scaleX: number = 1;
    start() {
        this.canvas = cc.find("Canvas");
        this.spiderAnimation = this.spider.getComponent(cc.Animation)
        this.body = this.node.getComponent(cc.RigidBody)
        this.phyBody = this.node.getComponent(cc.PhysicsPolygonCollider)
        this.scaleX = this.node.scaleX;
    }

    update(dt) {
        if (!this.isStart) return;

        this.moveByAction(dt);


        if (this.currAction == spiderActionType.walk) {
            let ang = this.node.angle > 360 ? this.node.angle % 360 : this.node.angle;
            if (ang <= 210 && ang >= 130) {
                this.doAction(spiderActionType.rotation)
            }
        }
    }
    //一直执行
    moveByAction(dt) {
        switch (this.currAction) {
            case spiderActionType.wait:

                break;
            case spiderActionType.walk:
                // console.log("=========walk=")
                let worldPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);
                let personPos = this.person.convertToWorldSpace(cc.Vec2.ZERO);

                this.node.scaleX = worldPos.x > personPos.x ? -this.scaleX : this.scaleX;
                let pos = this.node.position;

                let dis = tools.distanceVector(worldPos, personPos)
                let tmpX = worldPos.x > personPos.x ? -0.5 : 0.5;
                if (dis > 600) {
                    tmpX = worldPos.x > personPos.x ? -1 : 1;
                }

                if (dis > 300) {
                    this.node.runAction(cc.moveTo(dt, cc.v2(pos.x + tmpX, pos.y)))
                } else {
                    this.doAction(spiderActionType.attack);
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

                this.spiderAnimation.play("WaitClip")
                cc.tween(this.node).to(2, { angle: 0 })
                    .call(() => {
                        this.doAction(spiderActionType.walk);
                    }).start()

                break;
            case spiderActionType.wait:
                this.spiderAnimation.play("WaitClip")

                break;
            case spiderActionType.walk:
                this.spiderAnimation.play("WalkClip")


                break;
            case spiderActionType.attack:
                this.spiderAnimation.play("AttackClip")

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
                        this.phyBody.apply()
                    }).start();
                break;
            case moveStep.secend:
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

        //被石头砸中
        if (other.node.groupIndex == 12) {
            let body: cc.RigidBody = other.node.getComponent(cc.RigidBody)
            let vy = body.linearVelocity.y;
            if (vy <= -100) {
                this.canvas.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.NEXT);
                this.isStart = false;
            }
        }


    }
    //在产生物理碰撞效果结束
    onEndContact(contact, self, other) {

    }
}

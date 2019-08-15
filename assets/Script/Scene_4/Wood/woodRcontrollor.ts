
const { ccclass, property } = cc._decorator;

const direction = cc.Enum({
    Left: 0,
    Right: 1,
})
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    otherWood: cc.Node = null;

    @property(cc.Node)
    stone: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    @property({ type: cc.Enum(direction) })
    direct = direction.Right;

    // onLoad () {}
    isPerson: boolean = false;
    isSpider: boolean = false;
    step: number = 0;

    rightWood: cc.Node = null;
    leftWood: cc.Node = null;
    start() {
        this.rightWood = this.direct == direction.Right ? this.node : this.otherWood;
        this.leftWood = this.direct == direction.Right ? this.otherWood : this.node;
    }

    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 6) { //人   
            let body: cc.RigidBody = other.node.getComponent(cc.RigidBody);
            let selfBody: cc.RigidBody = this.node.getComponent(cc.RigidBody);
            if (!body || selfBody.type == cc.RigidBodyType.Dynamic) return;

            let vy = body.linearVelocity.y;

            if (vy <= -200) { //只有人-跳跃-才能踩断
                switch (this.step) {
                    // case 0:
                    //     cc.tween(this.otherWood).by(0.1, { angle: -12 }, { easing: 'sineIn' }).start();
                    //     cc.tween(this.node).by(0.1, { angle: 10 }, { easing: 'sineIn' }).start();
                    //     cc.tween(this.woodBridge).by(0.1, { angle: 2 }, { easing: 'sineIn' }).start();
                    //     this.isPerson = true
                    //     break;
                    // case 1:
                    //     cc.tween(this.otherWood).by(0.1, { angle: -13 }, { easing: 'sineIn' }).start();
                    //     cc.tween(this.node).by(0.1, { angle: 10 }, { easing: 'sineIn' }).start();
                    //     cc.tween(this.woodBridge).by(0.1, { angle: 2 }, { easing: 'sineIn' }).start();
                    //     this.isPerson = true
                    //     break;
                    case 0:
                        cc.tween(this.leftWood).by(1, { angle: -30 }, { easing: 'sineInOut' }).start();
                        cc.tween(this.rightWood).by(0.6, { angle: 20 }, { easing: 'sineInOut' }).call(
                            () => {//回调
                                this.leftWood.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                                this.leftWood.getComponent(cc.PhysicsPolygonCollider).apply();
                                this.rightWood.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                                this.rightWood.getComponent(cc.PhysicsPolygonCollider).apply();
                                this.stone.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                                this.stone.getComponent(cc.PhysicsCircleCollider).apply();
                            }
                        ).start()
                        break;
                    default:
                        break;
                }
                this.step++;
            }
        }
        
    }
    onCollisionStay(other, self) {

    }
    onCollisionExit(other, self) {

    }


    // update (dt) {}
}

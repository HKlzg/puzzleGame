
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
    woodBridge: cc.Node = null;
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
                        cc.tween(this.rightWood).by(1, { angle: 20 }, { easing: 'sineInOut' }).call(
                            () => {//回调
                                this.leftWood.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                                this.leftWood.getComponent(cc.PhysicsPolygonCollider).apply();
                                this.rightWood.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                                this.rightWood.getComponent(cc.PhysicsPolygonCollider).apply();
                                this.woodBridge.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                                this.woodBridge.getComponent(cc.PhysicsPolygonCollider).apply();
                            }
                        ).start()
                        break;
                    default:
                        break;
                }
                this.step++;
            }
        }
        // if (other.node.groupIndex == 19 && this.isPerson) {// 先断裂之后 蜘蛛才能再次压断
        //     if (!this.isSpider) {
        //         cc.tween(this.otherWood).by(1, { angle: -20 }, { easing: 'sineInOut' }).start();
        //         cc.tween(this.node).by(1, { angle: 10 }, { easing: 'sineInOut' }).call(
        //             () => {//回调
        //                 this.otherWood.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        //                 this.otherWood.getComponent(cc.PhysicsPolygonCollider).apply();
        //                 this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        //                 this.node.getComponent(cc.PhysicsPolygonCollider).apply();
        //                 this.woodBridge.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        //                 this.woodBridge.getComponent(cc.PhysicsPolygonCollider).apply();
        //             }
        //         ).start()
        //         this.isSpider = true
        //     }
        // }
    }
    onCollisionStay(other, self) {

    }
    onCollisionExit(other, self) {

    }


    // update (dt) {}
}

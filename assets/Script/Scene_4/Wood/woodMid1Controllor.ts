
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    spider: cc.Node = null;
    @property(cc.Node)
    woodRight: cc.Node = null;

    @property(cc.Node)
    woodBridge: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    isPerson: boolean = false;
    isSpider: boolean = false;

    start() {

    }

    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 6 || other.node.groupIndex == 2) { //人 /箱子

            if (!this.isPerson) {
                cc.tween(this.node).by(1, { angle: -10 }, { easing: 'sineOut' }).start()
                cc.tween(this.woodRight).by(1, { angle: 10 }, { easing: 'sineOut' }).start()
                this.isPerson = true
            }
        }
        if (other.node.groupIndex == 19) {//蜘蛛
            if (!this.isSpider) {
                cc.tween(this.node).by(1, { angle: -10 }, { easing: 'sineOut' }).start()
                cc.tween(this.woodRight).by(1, { angle: 10 }, { easing: 'sineOut' }).call(
                    () => {//回调
                        this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                        this.node.getComponent(cc.PhysicsPolygonCollider).apply();
                        this.woodRight.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                        this.woodRight.getComponent(cc.PhysicsPolygonCollider).apply();
                        this.woodBridge.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                        this.woodBridge.getComponent(cc.PhysicsPolygonCollider).apply();
                    }
                ).start()
                this.isSpider = true
            }
        }
    }
    onCollisionStay(other, self) {

    }
    onCollisionExit(other, self) {

    }


    // update (dt) {}
}

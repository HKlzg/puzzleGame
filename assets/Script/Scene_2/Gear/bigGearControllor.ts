const { ccclass, property } = cc._decorator;
class childType {
    node: cc.Node;
    initVec: cc.Vec2;
    angle: number;
    constructor(node: cc.Node, v: cc.Vec2, ang: number) {
        this.node = node;
        this.initVec = v;
        this.angle = ang;
    };
}
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    gear: cc.Node = null;

    @property(cc.Node)
    poleH: cc.Node = null;

    @property(cc.Node)
    poleV: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    phyChildrens: Array<childType> = [];

    prePos: cc.Vec2 = null;
    preAngle: number = 0;
    start() {
        this.addChildrens(this.node);
        this.prePos = this.node.position;
        this.preAngle = this.node.angle;
    }

    update(dt) {

        this.updateChildrenBody()
    }

    public openMachine() {
        cc.tween(this.poleH).to(1, { scaleX: 1.5 }).
            delay(0.5).
            call(() => {
                cc.tween(this.poleH).to(0.3, { scaleX: 2.5 }).
                    call(() => {
                        this.poleH.groupIndex = 5; //只与箱子碰撞
                        this.poleH.getComponent(cc.PhysicsBoxCollider).apply()
                    }).start();
            }).start()

        cc.tween(this.poleV).to(1, { scaleX: 1.5 }).
            delay(0.5).
            call(() => {
                cc.tween(this.poleV).to(0.3, { scaleX: 2.5 }).
                    call(() => {
                        this.poleV.groupIndex = 5; //只与箱子碰撞
                        this.poleV.getComponent(cc.PhysicsBoxCollider).apply()
                    }).start();
            }).start()
    }

    addChildrens(parent: cc.Node) {
        parent.children.forEach((node) => {
            if (node.childrenCount > 0) {
                this.addChildrens(node);
            }
            if (node.getComponent(cc.RigidBody)) {
                this.phyChildrens.push(new childType(node, node.position, node.angle));

            }
        });

    }
    //同步更新子节点的位置
    updateChildrenBody() {
        if (this.prePos.equals(this.node.position) && this.preAngle == this.node.angle) return

        this.phyChildrens.forEach((e) => {
            e.node.angle = 0;
            e.node.position = e.initVec;
            e.node.angle = e.angle;
        })
    }


}

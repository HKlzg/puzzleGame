import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;
const stoneType = cc.Enum({
    square: 0,
    triangle: 1
})

class stoneClass {
    type: number;
    node: cc.Node;
    rigidBody: cc.RigidBody;
    phyBody: cc.PhysicsBoxCollider | cc.PhysicsPolygonCollider;
    lineVec: cc.Vec2 = cc.Vec2.ZERO;

    isSlowAction: boolean = false; //是否在执行slow动画

    constructor(nodeSquera: cc.Node, nodeAngle: cc.Node, parent) {
        let type = Math.random() > 0.5 ? stoneType.square : stoneType.triangle;

        this.type = type;
        this.node = cc.instantiate(type == stoneType.square ? nodeSquera : nodeAngle);
        this.node.parent = parent;
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        if (type == stoneType.square) {
            this.phyBody = this.node.getComponent(cc.PhysicsBoxCollider);
        } else {
            this.phyBody = this.node.getComponent(cc.PhysicsPolygonCollider);
        }

        this.setDynamic();
        this.createSize(type);

    }
    createSize(type) {
        let random = Math.random();
        let posX = (random < 0.5 ? 0.5 : 1) * 300 * (random > 0.5 ? 1 : -1);

        this.node.position = cc.v2(posX, this.node.y + (type == stoneType.square ? 200 : 0));
        this.node.angle = random > 0.6 ? -30 : (random > 0.3 ? 30 : 0);
        this.node.scale = random < 0.2 ? 0.2 : random;
    }

    setStatic() {
        this.rigidBody.type = cc.RigidBodyType.Static;
        this.lineVec = this.rigidBody.linearVelocity;
        this.phyBody.apply()
    }
    setDynamic() {
        this.rigidBody.type = cc.RigidBodyType.Dynamic;
        this.rigidBody.linearVelocity = cc.v2(this.lineVec.x, this.lineVec.y - 100);
        this.phyBody.apply()
    }

    //缓动 每个stone 只执行一次
    moveSlow() {
        if (!this.isSlowAction) {
            this.isSlowAction = true;
            this.setStatic();
            cc.tween(this.node).by(3, { y: -200 })
                .call(() => {
                    this.setDynamic();
                })
                .start();
        }
    }

}

//控制石头掉落
@ccclass
export default class DynamicStoneControllor extends LogicBasicComponent {

    @property(cc.Node)
    stoneSquare: cc.Node = null;
    @property(cc.Node)
    stoneTriangle: cc.Node = null;
    isStoneAction: boolean = false;//是否在执行action

    stoneList: stoneClass[] = [];
    // onLoad () {}

    start() {
        //test
        // cc.tween(this.node).delay(3).call(() => {
        //     this.createStone();
        // }).start()
    }

    logicUpdate(dt) {

        for (let index = 0; index < this.stoneList.length; index++) {
            const stone = this.stoneList[index];
            //缓动
            if (stone.node && stone.node.y <= -300) {
                stone.moveSlow();
            }

            //销毁
            if (stone.node && stone.node.y <= -1500) {
                stone.node.destroy();
                //移除
                this.stoneList.splice(index, 1);
            }
        }

    }


    //生成一组石头
    public createStone() {
        for (let index = 0; index < 2; index++) {
            this.stoneList.push(new stoneClass(this.stoneSquare, this.stoneTriangle, this.node));
        }
    }

}

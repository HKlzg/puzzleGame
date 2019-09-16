import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;
const stoneType = cc.Enum({
    square: 1,
    triangle: 2,
})

class stoneClass {
    static lastPos: cc.Vec2;

    type: number;
    node: cc.Node;
    rigidBody: cc.RigidBody;
    phyBody: cc.PhysicsBoxCollider | cc.PhysicsPolygonCollider;

    lineVec: cc.Vec2 = cc.Vec2.ZERO;
    isBigStone: boolean = false;
    isSlowAction: boolean = false;
    currSqera: cc.Node = null;
    slowAction: cc.NewTween = null;

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
        let lastPosX = stoneClass.lastPos ? stoneClass.lastPos.x : 0;
        let lastPosY = stoneClass.lastPos ? stoneClass.lastPos.y : 0;

        let posX = random * 100 * (random >= 0.5 ? -1 : 1);

        this.node.position = cc.v2(posX, this.node.y + (lastPosY == 0 ? 200 : 0));
        this.node.scale = random < 0.2 ? 0.2 : random;
        this.node.angle = random > 0.5 ? this.node.angle : -this.node.angle;

        if (this.node.scale >= 0.6) {
            this.isBigStone = true;
            this.node.groupIndex = 13;  //可被碰撞
        } else {
            this.node.groupIndex = 0;
        }
        stoneClass.lastPos = this.node.position;
    }

    setStatic() {
        this.rigidBody.type = cc.RigidBodyType.Static;
        this.rigidBody.angularVelocity = this.node.angle > 0 ? 1 : -1;
        this.lineVec = this.rigidBody.linearVelocity;
        let children = this.node.children;
        children[0].active = true;
        this.currSqera = children[0];

        this.phyBody.apply()
    }
    setDynamic() {
        let children = this.node.children;
        children[0].active = false;

        this.currSqera = null;
        this.rigidBody.type = cc.RigidBodyType.Dynamic;
        this.rigidBody.angularVelocity = this.node.angle > 0 ? 10 : -10;
        this.rigidBody.linearVelocity = cc.v2(this.lineVec.x, this.lineVec.y - 200);
        this.phyBody.apply()
    }

    //对大石块缓动 每个stone 只执行一次
    moveSlow() {
        if (!this.isSlowAction && this.isBigStone) {
            this.isSlowAction = true;
            this.setStatic();
            this.slowAction = cc.tween(this.node)
                .by(5, { y: -300 })
                .call(() => {
                    this.setDynamic();
                })
                .start();
        }
    }
    //取消缓动
    stopSlow() {
        this.slowAction.stop();
        //设置横向速度
        this.rigidBody.linearVelocity.x += this.node.x > 0 ? 200 : -200;
        this.setDynamic();
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
            if (stone.node && stone.node.y <= -400) {
                stone.moveSlow();
                if (stone.isSlowAction && stone.currSqera) {
                    let ctrl = stone.currSqera.getComponent("stoneSqeraControllor");
                    //获取放置的箱子
                    if (ctrl.getBox()) {
                        stone.stopSlow();
                    }
                }
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
        let num = Math.random() > 0.5 ? 2 : 4;
        for (let index = 0; index < num; index++) {
            this.stoneList.push(new stoneClass(this.stoneSquare, this.stoneTriangle, this.node));
        }
    }

}

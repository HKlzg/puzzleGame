import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;
const type = cc.Enum({
    H: 0,
    V: 1
})
//齿轮 上的杆子控制器
@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    gear: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    @property({ type: type })
    poleType = type.H;
    // grap: cc.Graphics = null;
    referencePos: cc.Vec2 = null; //中心参考点

    // onLoad () {}
    start() {

        this.referencePos = this.node.parent.convertToWorldSpaceAR(cc.Vec2.ZERO)
    }

    logicUpdate(dt) { }

    //在物理碰撞之前
    onPreSolve(contact, self, other) {

        //碰撞到箱子 而且 只有水平 位置的有效
        if (other.node.groupIndex == 2 && this.poleType == type.H) {
            let gearCtrl = this.gear.getComponent("bigGearControllor");
            let isRotation = gearCtrl.getIsRotation();
            if (!isRotation) {
                let otherBody: cc.RigidBody = other.node.getComponent(cc.RigidBody);

                if (otherBody.linearVelocity.y < -50) {
                    let otherPos = other.node.convertToWorldSpaceAR(cc.Vec2.ZERO)
                    let gearPos = this.referencePos;

                    let ang = 0;
                    if (otherPos.x < gearPos.x) {//逆时针旋转 angle ++
                        ang = 90;
                    } else {
                        ang = -90;
                    }
                    //旋转 整个父节点
                    gearCtrl.rotation(ang);

                }
            }
        }
    }

    onPostSolve(contact, self, other) {
    }

    public changePoleType() {
        this.poleType = this.poleType == type.H ? type.V : type.H;
    }
}

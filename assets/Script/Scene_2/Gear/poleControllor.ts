import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import settingBasic from "../../Setting/settingBasic";

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

    @property({ type: type })
    poleType = type.H;

    // onLoad () {}
    start() {
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
                    let referencePos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);

                    let ang = 0;
                    if (otherPos.x < referencePos.x) {//逆时针旋转 angle ++
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

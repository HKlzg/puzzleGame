
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // @property(cc.Node)
    // gear: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    isRotation: boolean = false;
    start() {

    }

    update(dt) { }

    //在物理碰撞之前
    onPreSolve(contact, self, other) {
        // console.log("==1=onPreSolve==")
        if (other.node.groupIndex == 2) {
            // console.log("==1=onPreSolve==")
            if (!this.isRotation) {
                this.isRotation = true;
                let otherBody: cc.RigidBody = other.node.getComponent(cc.RigidBody);

                if (otherBody.linearVelocity.y < -50) {
                    let otherPos = other.node.convertToWorldSpace(cc.Vec2.ZERO)
                    otherPos.x += other.node.width / 2;
                    let selfPos = this.node.convertToWorldSpace(cc.Vec2.ZERO)
                    selfPos.x += this.node.width / 2;

                    let ang = self.node.parent.angle;
                    if (otherPos.x <= selfPos.x) {//逆时针旋转 angle ++
                        ang += 90;
                    } else {
                        ang -= 90;
                    }
                    //旋转 整个父节点
                    cc.tween(this.node.parent).to(1.5, { angle: ang }, { easing: "circIn" }).call(() => {
                        this.isRotation = false;
                        contact.disabled = true;
                     }).start()
                }
            } else {
                    cc.tween(this.node).delay(0.5).call(()=>{
                        contact.disabled = true;
                    }).start();
            }
        }
    }

    onPostSolve(contact, self, other) {

    }


}

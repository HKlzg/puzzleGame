import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.Float)
    tempHeight: number = -200; //下降的高度 默认值

    isDown: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    maxPos: cc.Vec2 = null;
    minPos: cc.Vec2 = null;
    body: cc.RigidBody = null;
    phyBody: cc.PhysicsBoxCollider = null;

    start() {
        this.maxPos = this.node.position;
        this.minPos = cc.v2(this.maxPos.x, this.maxPos.y + this.tempHeight);
        this.body = this.node.getComponent(cc.RigidBody);
        this.phyBody = this.node.getComponent(cc.PhysicsBoxCollider);

    }

    logicUpdate(dt) {
        let pos = this.node.position;
        this.node.x = this.maxPos.x;
        if (!this.isDown) { //上升
            if (pos.y >= this.maxPos.y) {
                this.body.type = cc.RigidBodyType.Static;
                this.phyBody.apply()

            }

        } else {  //下降
            if (pos.y <= this.minPos.y) {
                this.body.type = cc.RigidBodyType.Static;
                this.phyBody.apply()
            }
        }

    }

    //物理碰撞
    onBeginContact(contact, self, other) {

    }
    onEndContact(contact, self, other) {

    }

    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 2) {//box 
            if (!this.isDown) {
                this.isDown = true;
                this.body.gravityScale = 1;
                this.body.type = cc.RigidBodyType.Dynamic;
                this.phyBody.apply()
            }
        }
    }

    onCollisionStay(other, self) {
        if (other.node.groupIndex == 2) {//box 
            if (!this.isDown) {
                this.isDown = true;
            }
        }
    }
    onCollisionExit(other, self) {
        if (other.node.groupIndex == 2) {//box 
            if (this.isDown) {

                this.isDown = false;
                this.body.gravityScale = -5;
                this.body.type = cc.RigidBodyType.Dynamic;
                this.phyBody.apply()
            }
        }
    }

}

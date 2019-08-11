const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    cage: cc.Node = null;

    isDown: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    maxPos: cc.Vec2 = null;
    minPos: cc.Vec2 = null;
    body: cc.RigidBody = null;
    phyBody: cc.PhysicsBoxCollider = null;
    cageBody: cc.RigidBody = null;
    cagePhyBody: cc.PhysicsBoxCollider = null;

    start() {
        this.maxPos = this.node.position;
        this.minPos = cc.v2(this.maxPos.x, this.maxPos.y - 200);
        this.body = this.node.getComponent(cc.RigidBody);
        this.phyBody = this.node.getComponent(cc.PhysicsBoxCollider);
        this.cageBody = this.cage.getComponent(cc.RigidBody);
        this.cagePhyBody = this.cage.getComponent(cc.PhysicsBoxCollider);
    }

    update(dt) {
        let pos = this.node.position;
        this.node.x = this.maxPos.x;
        if (!this.isDown) { //上升
            if (pos.y >= this.maxPos.y) {
                this.body.type = cc.RigidBodyType.Static;
                this.phyBody.apply()

                // this.cageBody.type = cc.RigidBodyType.Static;
                // this.cagePhyBody.apply()
            }

        } else {  //下降
            if (pos.y <= this.minPos.y) {
                this.body.type = cc.RigidBodyType.Static;
                this.phyBody.apply()

                this.cageBody.type = cc.RigidBodyType.Static;
                this.cagePhyBody.apply()
            }
        }


    }


    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 2) {//box 
            if (!this.isDown) {
                this.isDown = true;
                this.body.gravityScale = 1;
                this.body.type = cc.RigidBodyType.Dynamic;
                this.phyBody.apply()

                //cage 上升
                this.cageBody.gravityScale = -10;
                this.cageBody.type = cc.RigidBodyType.Dynamic;
                this.cagePhyBody.apply()
            }

        }
    }

    // onCollisionStay(other, self) {
    //     if (other.node.groupIndex == 2) {//box 
    //         if (!this.isDown) {
    //             this.isDown = true;
    //         }
    //     }
    // }
    onCollisionExit(other, self) {
        if (other.node.groupIndex == 2) {//box 
            if (this.isDown) {

                this.isDown = false;
                this.body.gravityScale = -5;
                this.body.type = cc.RigidBodyType.Dynamic;
                this.phyBody.apply()

                //cage 下降
                this.cageBody.gravityScale = 3;
                this.cageBody.type = cc.RigidBodyType.Dynamic;
                this.cagePhyBody.apply()
            }

        }
    }
}

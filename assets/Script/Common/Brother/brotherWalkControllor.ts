
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    parentGravityScale:number = 10;
    start() {
        this.parentGravityScale = this.node.parent.getComponent(cc.RigidBody).gravityScale;
    }

    // update (dt) {}

    climbBoxStart() {
        let parent = this.node.parent;
        let tmpX = parent.scaleX > 0 ? 20 : -20;
        parent.runAction(cc.moveTo(0.5, cc.v2(parent.x + tmpX, parent.y + 100)));

        parent.getComponent(cc.RigidBody).gravityScale = 0;
        parent.getComponent(cc.PhysicsBoxCollider).sensor = true;
        parent.getComponent(cc.PhysicsBoxCollider).apply();
    }
    climbBoxMid() {
        let parent = this.node.parent;
        parent.runAction(cc.moveTo(0.5, cc.v2(parent.x, parent.y + 50)))

    }
    climbBoxEnd() {
        let parent = this.node.parent;
        let tmpX = parent.scaleX > 0 ? 50 : -50;
        parent.runAction(cc.moveTo(0.5, cc.v2(parent.x + tmpX, parent.y)))

        parent.getComponent(cc.RigidBody).gravityScale = this.parentGravityScale;
        parent.getComponent(cc.PhysicsBoxCollider).sensor = false;
        parent.getComponent(cc.PhysicsBoxCollider).apply();
    }
}

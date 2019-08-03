
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    parentGravityScale: number = 10;
    isClimbBox: boolean = false;
    isJump: boolean = false;
    start() {
        this.parentGravityScale = this.node.parent.getComponent(cc.RigidBody).gravityScale;
    }

    // update (dt) {}

    climbBoxStart() {
        if (this.isClimbBox) return;

        let parent = this.node.parent;
        let tmpX = parent.scaleX > 0 ? 30 : -30;
        parent.runAction(cc.moveTo(0.16, cc.v2(parent.x + tmpX, parent.y + 80)));

        parent.getComponent(cc.RigidBody).gravityScale = 0;
        parent.getComponent(cc.PhysicsBoxCollider).sensor = true;
        parent.getComponent(cc.PhysicsBoxCollider).apply();
        this.isClimbBox = true;
    }

    climbBoxMid() {
        let parent = this.node.parent;
        let tmpX = parent.scaleX > 0 ? 30 : -30;
        parent.runAction(cc.moveTo(0.32, cc.v2(parent.x + tmpX, parent.y + 50)))
    }

    climbBoxMid2() {
        let parent = this.node.parent;
        let tmpX = parent.scaleX > 0 ? 50 : -50;
        parent.runAction(
            cc.sequence(
                cc.moveTo(0.32, cc.v2(parent.x + tmpX, parent.y)),
                cc.callFunc(() => {
                    parent.getComponent(cc.RigidBody).gravityScale = this.parentGravityScale;
                    parent.getComponent(cc.PhysicsBoxCollider).sensor = false;
                    parent.getComponent(cc.PhysicsBoxCollider).apply();
                    parent.emit(settingBasic.gameEvent.brotherPlayState, false);
                })
            )
        )

    }
    climbBoxEnd() {
        this.node.parent.emit(settingBasic.gameEvent.brotherPlayState, false);

        this.isClimbBox = false;

    }

    //Jump
    jumpStart() {
        this.isJump = true;
        let pos: cc.Vec2 = this.node.parent.position;
        let action = cc.jumpTo(1, cc.v2(pos.x, pos.y), 210, 1);
        this.node.parent.runAction(action);
    }
    jumpEnd() {
        this.node.parent.emit(settingBasic.gameEvent.brotherPlayState, false);
        this.isJump = false;
    }


}

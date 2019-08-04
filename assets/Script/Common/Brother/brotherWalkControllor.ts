
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    parentGravityScale: number = 10;
    isClimbBox: boolean = false;
    isJump: boolean = false;
    jumpXdist:number = 0;//水平跳跃距离
    start() {
        this.parentGravityScale = this.node.parent.getComponent(cc.RigidBody).gravityScale;
        this.node.on(settingBasic.gameEvent.brotherJumpEvent,this.setJumpX,this)
    }

    // update (dt) {}
    //--------------climbBox------------------暂时取消------------
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

    //------------------------Jump
    setJumpX(dist){
        this.jumpXdist = dist?dist:0;
    }
    jumpStart() {
        let parent = this.node.parent;
        this.isJump = true;
        let pos: cc.Vec2 = this.node.parent.position;
        let temp = this.jumpXdist;
        let action1 = cc.jumpTo(1, cc.v2(pos.x, pos.y), 200, 1);
        let action2 = cc.moveTo(0.6, cc.v2(pos.x + temp, pos.y))
        parent.runAction(
            cc.spawn(
                action1, action2
            )
        );
    }
    JumpMid() {

    }

    jumpEnd() {
        this.node.parent.emit(settingBasic.gameEvent.brotherPlayState, false);
        this.isJump = false;
    }


}


const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";

@ccclass
export class BrotherBasic extends cc.Component {
    @property(cc.Node)
    brotherWalkNode: cc.Node = null;
    @property(cc.Node)
    brotherClimbNode: cc.Node = null;

    brotherAnimation: cc.Animation = null;
    isMove: boolean = false;
    collider: cc.PhysicsBoxCollider = null;
    @property(cc.Node)
    Circerl:cc.Node = null;

    anmstate = null;

    //方向 L/R/U/D 
    //动作 WAIT/WALK/CLIMB
    order: { direction: string, action: string } = null;

    onLoad() {
        this.brotherAnimation = this.brotherWalkNode.getComponent(cc.Animation);
        this.node.on(settingBasic.gameEvent.brotherActionEvent, this.brotherAction, this);
        this.order = { direction: "L", action: "WAIT" };
        //初始状态
        this.brotherWalkNode.active = true;
        this.brotherClimbNode.active = false;

        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
    }

    start() {
    }

    //更新动作
    brotherAction(msg: { direction: string, action: string }) {
        this.order = msg;

        this.node.scaleX = (this.order.direction == "L" || this.order.direction == "LU") ? -1 : 1;


        switch (this.order.action.toUpperCase()) {
            case "WAIT":
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate= this.brotherAnimation.play("WaitClip");
                this.isMove = false;
                this.Circerl.active = false;

                break;
            case "WALK":
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate= this.brotherAnimation.play("WalkClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;

            case "CLIMB":
                this.brotherWalkNode.active = false;
                this.brotherClimbNode.active = true;
                this.anmstate= this.brotherAnimation.play("ClimbClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;
            case "JUMP":
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate= this.brotherAnimation.play("JumpClip");
                this.isMove = true;
                this.Circerl.active = false;
                break;
            case "MAGIC":
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.anmstate = this.brotherAnimation.play("MagicClip");
                this.Circerl.setPosition(this.Circerl.parent.convertToNodeSpaceAR((this.node.convertToWorldSpace(cc.v2(0,0)))));
                this.Circerl.active = true;
                this.isMove = true;
                break;
            default:
                break;
        }
    }

    update(dt) {
        //更新位置
        if (this.isMove) {
            switch (this.order.action.toUpperCase()) {
                case "WAIT":

                    break;
                case "WALK":
                    this.node.scaleX > 0 ? this.node.x += 2
                        : this.node.x -= 2;

                    break;
                case "CLIMB":
                    this.order.direction == "U" ? this.node.y += 2 : this.node.y -= 2;
                    break;
                    
                case "JUMP":

                    break;
                case "MAGIC":

                    break;

                default:
                    break;
            }
            this.collider ? this.collider.apply() : null;
        }
    }
}

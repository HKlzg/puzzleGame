
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
    }

    start() {

    }

    //更新动作
    brotherAction(msg: { direction: string, action: string }) {
        this.order = msg;

        // this.order.direction = this.order.direction ? (this.order.direction == "R" ? "R" : "L") : "L";

        this.node.scaleX = this.order.direction == "L" ? -1 : 1;


        switch (this.order.action.toUpperCase()) {
            case "WAIT":
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.brotherAnimation.play("WaitClip");
                this.isMove = false;

                break;
            case "WALK":
                this.brotherWalkNode.active = true;
                this.brotherClimbNode.active = false;
                this.brotherAnimation.play("WalkClip");
                this.isMove = true;
                break;

            case "CLIMB":
                this.brotherAnimation.play("ClimbClip");
                this.brotherWalkNode.active = false;
                this.brotherClimbNode.active = true;
                this.isMove = true;
                break;
            default:
                break;
        }
    }

    update(dt) {
        //更新位置
        if (this.isMove) {
            // console.log("============this.order.direction="+this.order.direction)
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
                default:
                    break;
            }

        }
    }
}

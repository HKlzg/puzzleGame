
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    walkNode: cc.Node = null;

    isJump: boolean = false;
    onLoad() { }

    start() {
        this.node.on(settingBasic.gameEvent.jumpStartEvent, this.startJump, this)
    }

    // update(dt) {      
    //  }
    startJump(isStart) {
        this.isJump = isStart;
    }
    onCollisionEnter(other, self) {
        if (this.isJump && (other.node.groupIndex == 2 || other.node.groupIndex == 4)) {
             //跳跃过程中 踩到箱子或者地面则停止跳跃 
            this.walkNode.getComponent("brotherWalkControllor").jumpEnd();
            this.isJump = false;
        }
    }

}

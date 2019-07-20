import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class RopeConnectBasic extends cc.Component {

    onLoad() {
        // 自定义事件
        this.node.on(settingBasic.gameEvent.ropeOnBeginContact, this.ropeOnBeginContactEvent, this)
    }

    start() {

    }
    //绳子碰撞检测  由绳子的父节点控制
    ropeOnBeginContactEvent(event) {
        let contact = event["contact"];
        let ropeCollider = event["selfCollider"];
        let otherCollider = event["otherCollider"];

        // 移除掉在地上 4-ground 的绳子
        if (otherCollider.node.groupIndex == 4) {
            ropeCollider.node.parent.removeChild(ropeCollider.node);
        }
        this.ropeOnBeginContact(contact, ropeCollider, otherCollider);
    }
    //由子类实现
    abstract ropeOnBeginContact(contact, ropeCollider, otherCollider);

    // update (dt) {}
}

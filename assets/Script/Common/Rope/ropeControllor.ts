import settingBasic from "../../Setting/settingBasic";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad() {

    }
    start() {

    }

    onBeginContact(contact, selfCollider, otherCollider) {

        let ropeConnectNode = this.node.parent.parent;
        let msg = {};
        msg["contact"] = contact;
        msg["selfCollider"] = selfCollider;
        msg["otherCollider"] = otherCollider;
        //将事件发射的父节点处理
        ropeConnectNode.emit( settingBasic.gameEvent.ropeOnBeginContact, msg);



    }
}

import setting from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

 
    isBroken: boolean = false;
    canvasNode:cc.Node = null;
    body :cc.RigidBody = null;
    start() {
        this.canvasNode = cc.find("Canvas");
        this.body = this.node.getComponent(cc.RigidBody);
     }


    onEndContact(contact, selfCollider, otherCollider) {
 
        if (!this.isBroken && otherCollider.node.groupIndex == 8) {//石头
            //触发第一步骤
            this.canvasNode.emit(setting.gameEvent.gameStepEvent,"1");
            this.isBroken = true;
        }
    }

    update (dt) {
        

    }
}

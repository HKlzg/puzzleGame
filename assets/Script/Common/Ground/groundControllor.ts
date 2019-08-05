import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ground extends cc.Component {

    private canvasNode = null;
    onLoad() {
        this.canvasNode = cc.find("Canvas")
    }

    onBeginContact(contact, selfCollider, otherCollider) {

       

    }
}

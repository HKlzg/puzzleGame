import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ground extends LogicBasicComponent {

    private canvasNode = null;
    onLoad() {
        this.canvasNode = cc.find("Canvas")
    }

    onBeginContact(contact, selfCollider, otherCollider) {

       

    }
    logicUpdate(){}
}

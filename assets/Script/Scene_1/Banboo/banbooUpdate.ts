import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {
    start () {

    }
    onEnable(){
        this.node.parent.getComponent(cc.WheelJoint).apply();
    }

    logicUpdate (dt) {}
}


const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Animation)
    monster: cc.Animation = null;

    @property(cc.Node)
    area: cc.Node = null;
    start() {
    
    }

    logicUpdate(dt) { }
    //物理碰撞
    onPreSolve(contact, self, other) {

    }
    //传感器

    onCollisionEnter(other, self) {
        if(other.node.name == "Tiger"){
            this.area.getComponent("InductionAreaControl").changeStop(true);
            this.monster.getComponent("monsterClipControllor").changeStop(true);
        }
    }
    onCollisionStay(other, self) {

    }
    onCollisionExit(other, self) {
        if(other.node.name == "Tiger"){
            this.area.getComponent("InductionAreaControl").changeStop(false);
        }
    }

}

import toolsBasics from "../../Tools/toolsBasics";
import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";
const { ccclass, property } = cc._decorator;

@ccclass
export default class River extends LogicBasicComponent {

    @property(cc.Node)
    river: cc.Node = null;
    @property(cc.Float)
    far_speed = -5;

    long: number = 0;
    onLoad() {
      
    }

    logicUpdate(dt) {
        toolsBasics.playLoopFlow(this.river, this.far_speed);

    }


}
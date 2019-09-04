import toolsBasics from "../../Tools/toolsBasics";
import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";
const { ccclass, property } = cc._decorator;

@ccclass
export default class River extends LogicBasicComponent {

    @property(cc.Node)
    far_bg: Array<cc.Node> = []
    @property(cc.Float)
    far_speed = 0.2;

    long: number = 0;
    onLoad() {
        toolsBasics.photoSetPos(this.far_bg[0], this.far_bg[1]);
    }

    logicUpdate(dt) {
        toolsBasics.photoScroll(this.far_bg, this.far_speed);


    }


}
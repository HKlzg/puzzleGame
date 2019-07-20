import toolsBasics from "../../Tools/toolsBasics";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    far_bg: Array<cc.Node> = []
    @property(cc.Float)
    far_speed = 0.2;

    onLoad() {
        toolsBasics.photoSetPos(this.far_bg[0], this.far_bg[1]);
    }

    update(dt) {
        toolsBasics.photoScroll(this.far_bg, this.far_speed);
    }
}

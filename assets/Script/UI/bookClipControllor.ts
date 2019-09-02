import settingBasic from "../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //翻页之后触发
        if (settingBasic.game.State == settingBasic.setting.stateType.PAUSE) {
            this.node.children.forEach(e => {
                e.active = false;
            })
            this.node.children[this.node.childrenCount - 1].active = true;
        }
    }

    start() {

    }

    // update (dt) {}
}

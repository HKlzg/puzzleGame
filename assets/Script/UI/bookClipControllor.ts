import settingBasic from "../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //翻页之后触发 --若只是翻页 则直接显示封面最后一张
        if (settingBasic.game.State == settingBasic.setting.stateType.PAUSE) {
            this.node.children.forEach(e => {
                e.active = false;
            })
            this.node.children[8].active = true;
        }
    }

    start() {

    }

    // update (dt) {}
}

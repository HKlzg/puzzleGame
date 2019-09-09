
const { ccclass, property } = cc._decorator;
/**
 * 纸条信息
 */
@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }
    start() {
        this.node.opacity = 0;
        cc.tween(this.node).delay(0.5).then(cc.fadeIn(0.5)).start();

    }
    // update (dt) {}

    onClick() {
        cc.tween(this.node).to(0.5, { position: cc.v2(288.39, 545.794), scale: 0.1 }, { easing: "sineIn" }).call(() => {
            this.node.destroy()
        }).start()

    }
}

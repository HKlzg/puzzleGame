import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
const type = cc.Enum({
    In: 1,
    Out: 2
})
//进入下一关的通道
@ccclass
export default class NewClass extends cc.Component {

    @property({ type: type })
    outOrIn = type.In;

    isContact: boolean = false;
    // onLoad () {}
    collider: cc.BoxCollider = null;
    isCanTouch: boolean = false; //在切换场景之后 是否能碰撞
    start() {

    }
    onEnable() {
        cc.tween(this.node).delay(3).call(() => {
            this.isCanTouch = true;
        }).start();


    }
    onDisable() {
        this.isCanTouch = false;
        this.isContact = false;
    }
    // update (dt) {}

    onCollisionEnter(other, self) {
        if (!this.isContact && other.node.groupIndex == 6 && this.isCanTouch) {
            let canvas = cc.find("Canvas").getComponent("CanvasControllor");
            this.isContact = true;
            if (this.outOrIn == type.Out) {
                canvas.loadNextScene();
            } else {
                canvas.loadLastScene();
            }

        }
    }
}

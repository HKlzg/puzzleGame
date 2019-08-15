
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.RigidBody)
    body: cc.RigidBody = null;
    @property()
    deathVyMax: number = -200;
    canvas: cc.Node = null;
    isContact: boolean = false;
    // onLoad () {}
    start() {
        this.canvas = cc.find("Canvas");
    }

    // update (dt) {}

    onCollisionEnter(other, self) {
        if (!this.isContact && other.node.groupIndex == 6) { //人碰到 就over
            let vy = this.body.linearVelocity.y
            if (vy < this.deathVyMax) {
                this.canvas.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.REBORN);
                this.canvas.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.RESTART);
                this.isContact = true;
            }

        }
    }


}

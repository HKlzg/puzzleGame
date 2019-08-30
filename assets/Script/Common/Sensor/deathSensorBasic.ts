
const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

@ccclass
export default class NewClass extends LogicBasicComponent {
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

    logicUpdate (dt) {}

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


const { ccclass, property } = cc._decorator;
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";
import settingBasic from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.RigidBody)
    body: cc.RigidBody = null;
    @property()
    deathVyMax: number = -200;
    currScene: cc.Node = null;
    isContact: boolean = false;
    // onLoad () {}
    start() {
        this.currScene = cc.find("Canvas/"+settingBasic.game.currScene);
    }

    logicUpdate (dt) {}

    onCollisionEnter(other, self) {
        if (!this.isContact && other.node.groupIndex == 6) { //人碰到 就over
            let vy = this.body.linearVelocity.y
            if (vy < this.deathVyMax) {
                this.currScene.emit(setting.gameEvent.gameStateEvent, setting.setting.stateType.RESTART);
                this.isContact = true;
            }

        }
    }


}

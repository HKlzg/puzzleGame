import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    gearL: cc.Node = null;
    @property(cc.Node)
    gearU: cc.Node = null;
    @property(cc.Node)
    gearR: cc.Node = null;
    @property(cc.Float)
    rotateSpeed: number = 0.2;
    start() {

    }

    logicUpdate(dt) {
        this.setSpeed();
    }
    setSpeed() {
        this.gearL.angle += this.rotateSpeed;
        this.gearR.angle += -this.rotateSpeed;
        this.gearU.angle += this.rotateSpeed * 0.8;

        this.gearL.angle = this.gearL.angle > 360 ? this.gearL.angle % 360 : this.gearL.angle;
        this.gearR.angle = this.gearR.angle > 360 ? this.gearR.angle % 360 : this.gearR.angle;
        this.gearU.angle = this.gearU.angle > 360 ? this.gearU.angle % 360 : this.gearU.angle;
    }

}

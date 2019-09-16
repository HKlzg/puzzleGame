import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {

    box: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    logicUpdate(dt) { }

    onCollisionEnter(other, self) {
        if (other.node.groupIndex == 2) { //box
            if (!this.box) {
                this.box = other.node;
                cc.tween(this.node).then(cc.fadeOut(0.2)).start();

            }
        }
    }
    onCollisionStay(other, self) {
        if (other.node.groupIndex == 2) { //box
            if (!this.box) {
                console.log("===========box enter===")
                this.box = other.node;
                cc.tween(this.node).then(cc.fadeOut(0.2)).start();

            }
        }
    }
    onCollisionExit(other, self) {
        if (other.node.groupIndex == 2) { //box
            this.box = null;
            cc.tween(this.node).then(cc.fadeIn(0.2)).start();
        }
    }

    public getBox(): cc.Node {
        return this.box;
    }

}

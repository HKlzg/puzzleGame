
const { ccclass, property } = cc._decorator;

const sensorType = cc.Enum({
    start: 0,
    mid1: 1
})

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    spiderNode: cc.Node = null;

    @property({ type: cc.Enum(sensorType) })
    type = sensorType.start;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    isContact: boolean = false;
    start() {

    }

    // update (dt) {}
    onCollisionEnter(other, self) {

        switch (this.type) {
            case sensorType.start:

                if (!this.isContact && other.node.groupIndex == 6) {
                    let contrl = this.spiderNode.getComponent("spiderControllor");
                    if (contrl) {
                        contrl.nexSetp();
                        this.isContact = true;
                    }
                }
                break;

            default:
                break;
        }

    }
}

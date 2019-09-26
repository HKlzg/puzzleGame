import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

const sensorType = cc.Enum({
    sensor0: 0,
    sensor1: 1,
    sensor2: 2,
})
//爬行动画
const autoAnimType = cc.Enum({
    zeroth: 0,
    first: 1,
    secend: 2,
})
@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    spiderNode: cc.Node = null;

    @property({ type: cc.Enum(sensorType) })
    type = sensorType.sensor1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    isContact: boolean = false;
    start() {

    }

    logicUpdate(dt) { }

    onCollisionEnter(other, self) {

        switch (this.type) {
            case sensorType.sensor0:
                //蜘蛛下爬 动画
                this.spiderNode.getComponent("spiderControllor").playAutoAnimation(autoAnimType.zeroth);
                break;
            case sensorType.sensor1:
                //蜘蛛上爬 动画1
                this.spiderNode.getComponent("spiderControllor").playAutoAnimation(autoAnimType.first);
                break;
            case sensorType.sensor2:
                //蜘蛛上爬 动画1
                this.spiderNode.getComponent("spiderControllor").playAutoAnimation(autoAnimType.secend);
                break;

            default:
                break;
        }

    }
}

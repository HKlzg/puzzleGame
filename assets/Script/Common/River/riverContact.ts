import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Integer)
    tangntSpeed: number = 5;


    start() {

    }
    logicUpdate(){}

    onPreSolve(contact, self, other) {

        if (other.node.groupIndex == 2) {
            contact.setTangentSpeed(this.tangntSpeed)
            //箱子
            // let box = other.node;
            // let action = cc.repeat(
            //     cc.spawn(
            //         cc.sequence(
            //             cc.moveTo(0.5, box.x, box.y + 20),
            //             cc.moveTo(0.4, box.x, box.y - 20)
            //         ),
            //         cc.moveTo()
            //     )
            //     , 2);
            // box.runAction(action)
        }
    }
}

import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    logicUpdate (dt) {
        this.node.getComponent(cc.PhysicsCircleCollider).apply()
    }

    
}

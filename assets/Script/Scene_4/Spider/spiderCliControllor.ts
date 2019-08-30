import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    logicUpdate (dt) {}
}

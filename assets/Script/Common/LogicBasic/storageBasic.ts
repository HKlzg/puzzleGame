import { LogicBasicComponent } from "./LogicBasicComponent";

const { ccclass, property } = cc._decorator;
/**
 * 此类只是用于 没有挂载特殊功能脚本的节点 来序列化
 */
@ccclass
export default class StorageBasic extends LogicBasicComponent {
    // LIFE-CYCLE CALLBACKS:

    onLoad() { }

    start() {

    }

    logicUpdate(dt) {
    }


}

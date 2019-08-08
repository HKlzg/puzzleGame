
const { ccclass, property } = cc._decorator;

@ccclass
export default class LeopardControllor extends cc.Component {

    @property(cc.Node)
    personNode: cc.Node = null;

 
    start() {

    }

    // update (dt) {}
}

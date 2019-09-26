
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    earthkingNode: cc.Node = null;
    ismove = false;

    start () {
          






    }

    onCollisionEnter(other, self) {
        if (other.node.name == "Brother"&&!this.ismove) {            
            this.earthkingNode.getComponent("earthKingControllor").changeState();
            this.ismove = true;
        }
    }

    // update (dt) {}
}

 
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    branchNode:cc.Node = null;

    canvasNode: cc.Node = null;
 
    start () {

    }

    onEndContact(contact, selfCollider, otherCollider){
        
        if(otherCollider.node.groupIndex == 2){//箭
            if(this.branchNode.rotation >= 35 && this.branchNode.rotation <= 170){
                this.branchNode.runAction(cc.rotateBy(0.1,10))
            }
        }

    }

    // update (dt) {}
}

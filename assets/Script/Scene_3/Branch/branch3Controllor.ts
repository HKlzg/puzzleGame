 
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    canvasNode: cc.Node = null;
 
    start () {

    }

    onEndContact(contact, selfCollider, otherCollider){
        
        if(otherCollider.node.groupIndex == 2){//箭
            if(this.node.rotation >= 35 && this.node.rotation <= 170){
                this.node.runAction(cc.rotateBy(0.1,-10))
            }
        }

    }
    
    // update (dt) {}
}

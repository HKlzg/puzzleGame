
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    stone: cc.Node = null;


    onCollisionEnter(other, self) {
        if (other.node.name == "Brother") {            
             this.stone.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
            //  this.stone.getComponent(cc.PhysicsCircleCollider).apply();
        }
    }

    start () {

    }

    // update (dt) {}
}

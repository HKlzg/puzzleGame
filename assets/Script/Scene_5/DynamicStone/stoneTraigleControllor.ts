
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start () {

        
    }
    onCollisionEnter(other, self){
        if (other.node.groupIndex == 14) {
          this.destroy();
        }
    }

    // update (dt) {}
}

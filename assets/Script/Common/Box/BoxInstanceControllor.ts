 
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  
    start () {

    }

    update (dt) {
        if(this.node.y<-1500){
            this.node.removeFromParent()
        }
    }
}

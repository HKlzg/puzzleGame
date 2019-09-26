
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start () {

    }
    onBeginContact(contact, self, other){

        if(other.node.name =="SpiderNode"){
     
            


        }
    }

    // update (dt) {}
}

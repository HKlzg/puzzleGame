 
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Integer)
    tangntSpeed: number = 5;

  
    start () {

    }

    onPreSolve(contact,self,other){
        contact.setTangentSpeed(this.tangntSpeed)
    }
}

import settingBasic from "../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
 
    @property(cc.Node)
    bookMark: cc.Node = null;

   
    start() {
    }
    // update (dt) {}

    click() {
       
        this.bookMark.getComponent("bookMarkControllor").bookOnClick();
       
    }
}



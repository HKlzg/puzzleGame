
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    bookMark: cc.Node = null;



    // onLoad () {}

    start() {
        this.bookMark = cc.find("UIMask/UICamera/bookNode/bookmark")
        
    }

    // update (dt) {}

    click(){
        this.bookMark.getComponent("bookMarkControllor").bookOnClick();
    }
}

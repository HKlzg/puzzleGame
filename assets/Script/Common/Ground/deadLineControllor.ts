
const {ccclass, property} = cc._decorator;
import setting from "../../Setting/settingBasic";
@ccclass
export default class NewClass extends cc.Component {
 
    // onLoad () {}
    canvas:cc.Node = null;
    isContact:boolean = false;

    start () {
        this.canvas = cc.find("Canvas");
    }

    // update (dt) {}
    onBeginContact(contact,self,other){
        //和人物碰撞 游戏结束
        if(!this.isContact && other.node.groupIndex == 6){
            this.canvas.emit(setting.gameEvent.gameStateEvent,setting.setting.stateType.OVER);
            this.isContact = true;
        }
    }
}

import setting from "../../Setting/settingBasic"
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    textLable:cc.Label = null;

    canvas: cc.Node = null;
    onLoad() {
        this.canvas = cc.find("Canvas");
     }
    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.changeRole,this)
    }

    // update (dt) {}
    //切换角色
    changeRole() {
        setting.game.currRole = setting.game.currRole == 1 ? 2 : 1;
        this.canvas.emit(setting.gameEvent.gameRoleEvent, setting.game.currRole)
        this.textLable.string = setting.game.currRole == 1 ?"召唤":"返回";
     }
}

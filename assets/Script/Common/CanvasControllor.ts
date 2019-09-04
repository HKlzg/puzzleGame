import settingBasic from "../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

//用于初始化 参数
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    sceneList: cc.Node[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad() { }

    start() {
        settingBasic.game.currScene = this.sceneList[0].name;
        
    }

    // update (dt) {}
}

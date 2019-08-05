
const { ccclass, property } = cc._decorator;
import settingBasic from "../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    onLoad() {

        //开启物理系统 ----------必须写在onLoad 里面
        cc.director.getPhysicsManager().enabled = true;

        // //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;

        settingBasic.fun.setScene("homePage", cc.director.getScene());
    }
    start() {

    }

    // update (dt) {}
}

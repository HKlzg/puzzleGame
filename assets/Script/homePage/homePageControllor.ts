
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.AudioSource)
    bgm: cc.AudioSource = null;

    onLoad() {
        cc.audioEngine.play(this.bgm.clip, true, 0.6)

        //开启物理系统 ----------必须写在onLoad 里面
        cc.director.getPhysicsManager().enabled = true;

        // //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
    }
    start() {

    }

    // update (dt) {}
}

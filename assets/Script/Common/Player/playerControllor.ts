
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.AudioSource)
    releaseBowAS: cc.AudioSource = null;
    @property(cc.AudioSource)
    pullBowAS: cc.AudioSource = null;

    onLoad() {

    }

    start() {

    }
    //动画自动调用 发射弓箭音效
    releaseAuido() {
        this.releaseBowAS.stop();
        this.pullBowAS.stop();
        this.releaseBowAS.play();
        // cc.audioEngine.stop(this.releaseBowAS.clip, false, 1);
        // cc.audioEngine.play(this.releaseBowAS.clip, false, 1);

    }
    //动画自动调用 拉弓音效
    dragAudio() {
        this.pullBowAS.stop();
        this.pullBowAS.play();
        // cc.audioEngine.stop(this.pullBowAS.clip, false, 1);
        // cc.audioEngine.play(this.pullBowAS.clip, false, 1);
    }
}

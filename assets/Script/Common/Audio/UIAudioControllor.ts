
const { ccclass, property } = cc._decorator;

//此类可直接通过类名调用
@ccclass
export default class UIAudioManager {

    audioList: { [key: string]: cc.AudioClip } = {};
    audioName: string = '';
    isEnablePlay: boolean = true;
    currMusicName: string = "";
    protected static UIAudioManager: UIAudioManager = new UIAudioManager();

    constructor() {
        //加载音乐文件
        cc.loader.loadResDir('Audio/UI', cc.AudioClip, function (err, clips) {
            if (err) {
                console.log("===Audio/UI load fail:" + err.message)
            } else {
                for (let i = 0; i < clips.length; i++) {
                    // console.log("===UI name :" + clips[i].name)
                    UIAudioManager.UIAudioManager.addAudio(clips[i].name, clips[i]);
                }
            }
        });
    }

    public static getUIAudioManager(): UIAudioManager {
        return this.UIAudioManager ? this.UIAudioManager : new UIAudioManager();
    }

    addAudio(name: string, clip: cc.AudioClip) {
        this.audioList[name] = clip;
    }

    //播放音频
    playAudio(name: string, isLoop?: boolean): number {
        if (this.isEnablePlay && this.audioList[name]) {
            let loop = isLoop ? isLoop : false;
            return cc.audioEngine.playEffect(this.audioList[name], loop);
        }
        return 0;
    }

    /**BGM 只能同时播放一个(播放循环的音乐)
     *  */
    playLoopBGM(name: string): number {
        if (this.isEnablePlay && this.audioList[name]) {
            this.currMusicName = name;
            return cc.audioEngine.playMusic(this.audioList[name], true);
        }
        return 0;
    }
    //停止背景音乐
    stopMusic() {
        cc.audioEngine.stopMusic();
    }
    //停止音效
    stopAudioById(id: number) {
        cc.audioEngine.stopEffect(id);
    }
    //停止音效
    // stopEffectByID(id: number) {
    //     cc.audioEngine.stopEffect(id);
    // }
    //停止所有音效
    stopEffects() {
        cc.audioEngine.stopAllEffects();
    }

    //设置是否播放/停止
    setEnablePlay(enable: boolean) {

        this.isEnablePlay = enable;
        this.isEnablePlay && this.currMusicName ?
            cc.audioEngine.playMusic(this.audioList[this.currMusicName], true) :
            cc.audioEngine.stopAll();
    }

    getEnable(): boolean {
        return this.isEnablePlay;
    }

    setVolume(volume: number) {
        cc.audioEngine.setEffectsVolume(volume);
        cc.audioEngine.setMusicVolume(volume);
    }
}

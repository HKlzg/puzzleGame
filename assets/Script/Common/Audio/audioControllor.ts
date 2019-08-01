
const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager {

    audioList: { [key: string]: cc.AudioClip } = {};
    audioName: string = '';
    isEnablePlay: boolean = true;
    currMusicName: string = "";
    protected static audioManager: AudioManager = new AudioManager();

    constructor() {
        //加载音乐文件
        cc.loader.loadResDir('Audio', cc.AudioClip, function (err, clips) {
            for (let i = 0; i < clips.length; i++) {
                AudioManager.audioManager.addAudio(clips[i].name, clips[i]);
            }
        });
    }

    public static getAudioManager(): AudioManager {
        return this.audioManager ? this.audioManager : new AudioManager();
    }

    addAudio(name: string, clip: cc.AudioClip) {
        this.audioList[name] = clip;
    }

    //播放音频
    playAudio(name: string) {
        this.isEnablePlay && this.audioList[name] ?
            cc.audioEngine.playEffect(this.audioList[name], false) : null;
    }

    //播放循环的音乐
    playLoopMusic(name: string) {
        if (this.isEnablePlay && this.audioList[name]) {
            cc.audioEngine.playMusic(this.audioList[name], true);
            this.currMusicName = name;
        }
    }
    //停止背景音乐
    stopMusic() {
        cc.audioEngine.stopMusic();
    }
    //停止音效
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

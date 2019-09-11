import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
//音量类型
class volumeType {
    id: number;
    audioNode: cc.Node;
    minVolume: number;
    maxVolume: number;
    constructor(id, audioNode, min, max) {
        this.id = id;
        this.audioNode = audioNode;
        this.minVolume = min;
        this.maxVolume = max;
    }
}
// 此音频管理是绑定了节点  需要实例化 不能使用静态直接调用
@ccclass
export default class AudioManager extends cc.Component {

    audioList: { [key: string]: cc.AudioClip } = {};
    audioName: string = '';
    isEnablePlay: boolean = true;
    currMusicName: string = "";
    cameraNode: cc.Node = null; //跟随人物的镜头
    dynamicAudioList: volumeType[] = [];// 需要动态调整音量的audioID
    canvasSize: cc.Size = null;
    background: cc.Node = null;
    backgroundInfo = { size: null, maxX: 0, minX: 0 }; //背景信息
    currScene: cc.Node = null;

    onLoad() {
        let self = this;
        //加载音乐文件
        cc.loader.loadResDir('Audio', cc.AudioClip, function (err, clips) {
            for (let i = 0; i < clips.length; i++) {
                self.addAudio(clips[i].name, clips[i]);
            }
        });

        this.canvasSize = cc.find("Canvas").getContentSize();
        this.currScene = cc.find("Canvas/" + settingBasic.game.currScene);
        this.cameraNode = this.currScene.getChildByName("Camera");
        this.background = this.currScene.getChildByName("Background")
        this.backgroundInfo.size = this.background.getContentSize();
        this.backgroundInfo.maxX = this.background.width / 2 + this.node.x;
        this.backgroundInfo.minX = -(this.background.width / 2 - this.node.x);
    }

    start() {

    }
    update() {
        //根据当前的人物的位置 更改音量 近大远小
        if (this.cameraNode && this.dynamicAudioList.length > 0) {
            let cameraPos = this.cameraNode.convertToWorldSpaceAR(cc.Vec2.ZERO);


            this.dynamicAudioList.forEach(audio => {
                let audioPos = audio.audioNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
                let tempX = Math.abs(cameraPos.x - audioPos.x);
                let distL = audioPos.x - this.backgroundInfo.minX;
                let distR = this.backgroundInfo.maxX - audioPos.x;
                let fastDist = distL > distR ? distL : distR;
                let rate = 1 - (tempX / fastDist);
                let curVol = audio.maxVolume * rate;
                curVol = curVol <= audio.minVolume ? audio.minVolume : curVol;
                curVol = curVol >= audio.maxVolume ? audio.maxVolume : curVol;
                cc.audioEngine.setVolume(audio.id, curVol)
            });
        }
    }

    //设置/更新 currScene
    public setCurrScene() {
        this.currScene = cc.find("Canvas/" + settingBasic.game.currScene);
    }

    addAudio(name: string, clip: cc.AudioClip) {
        this.audioList[name] = clip;
    }

    /**
     * 播放音频
     * @param name 
     * @param isLoop 是否循环
     * @param maxVolume 最大和当前的音量大小 默认为1
     * @param minVolume 最小值 
     * @param audioNode 当前播放的节点
     * @param isDynamic 是否动态调整音量
      */
    playAudio(name: string, isLoop?: boolean, maxVolume?: number, minVolume?: number, audioNode?: cc.Node, isDynamic?: boolean): number {

        if (this.isEnablePlay && this.audioList[name]) {
            let loop = isLoop ? isLoop : false;
            let id = cc.audioEngine.playEffect(this.audioList[name], loop);
            //优先以最小音量 大小为准
            minVolume > 0 ? cc.audioEngine.setVolume(id, minVolume) :
                maxVolume > 0 ? cc.audioEngine.setVolume(id, maxVolume) : null;
            if (isDynamic) {
                let isContains = false;
                for (let index = 0; index < this.dynamicAudioList.length; index++) {
                    if (id == this.dynamicAudioList[index].id) {
                        isContains = true;
                        break;
                    }
                }
                !isContains ? this.dynamicAudioList.push(new volumeType(id, audioNode, minVolume, maxVolume)) : null;
                // console.log("====playAudio=" + name + "      id= " + id + "  =len= " + this.dynamicAudioList.length)
            }
            return id;
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

    //设置是否播放/暂停
    setEnablePlay(enable: boolean) {

        this.isEnablePlay = enable;
        if (this.isEnablePlay && this.currMusicName) {
            cc.audioEngine.resumeMusic();
            cc.audioEngine.resumeAllEffects();
        } else {
            cc.audioEngine.pauseMusic();
            cc.audioEngine.pauseAllEffects();
        }
    }

    getEnable(): boolean {
        return this.isEnablePlay;
    }

    setVolume(volume: number) {
        cc.audioEngine.setEffectsVolume(volume);
        cc.audioEngine.setMusicVolume(volume);
    }
}

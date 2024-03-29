import settingBasic from "../Setting/settingBasic";
import toolsBasics from "../Tools/toolsBasics";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    bookClip: cc.Node = null;
    @property(cc.Node)
    light: cc.Node = null;

    @property(cc.Node)
    bookMark: cc.Node = null;

    audio = toolsBasics.getUIAudioManager();


    bookList: Array<cc.Node> = [];
    time = 0;
    id = 0;
    isOpen = true;
    isClose = true;

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

    start() {
        this.bookList = this.bookClip.children;        
    }
    onLoad(){
        
    }
    onEnable(){
        this.audio.playLoopBGM("bgm");
    }

    isOpenAnim() {
        this.playAudio();
        this.isOpen = false;
        this.changePos();
    }

    update(dt) {
        if (!this.isOpen && this.isClose == true) {
            this.time += 0.3;
            if (this.time >= 0.5) {
                if (this.id == 8) {
                    this.isOpen = true
                }
                this.changePic(this.id);
                if (this.id < this.bookList.length - 1) {
                    this.id++;
                }
                this.time = 0;
            }
        }

        if (!this.isClose && this.isOpen == true) {
            this.time += 0.3;
            if (this.time >= 0.5) {

                if (this.id == 0) {
                    this.isClose = true
                }
                this.changePic(this.id);
                if (this.id > 0) {
                    this.id--;
                }
                this.time = 0;
            }
        }
    }

    //更改封面pic 显示/关闭
    changePic(id: number) {        
        for (let index = 0; index < this.bookList.length; index++) {
            this.bookList[index].active = index == id;
        }
    }

    //通过动画更改 书状态
    changePos() {
        let speed = 0.8;
        var movTo = cc.moveTo(speed, cc.v2(26, 93));
        this.node.runAction(movTo);
        var rTo = cc.rotateTo(speed, 0);//第一个参数也是时间参数，将节点旋转180°
        this.node.runAction(rTo);
        var scTo = cc.scaleTo(speed, 0.8);//将节点缩放到2倍
        this.node.runAction(scTo);
        this.bookMark.active = true;
        // var faTo = cc.fadeTo(speed, 128);
        // this.light.runAction(faTo);
    }

    public closeBook() {
        this.playAudio();
        // console.log("=====closeBook=====")
        let speed = 0.8;
        this.isClose = false;

        var movTo = cc.moveTo(speed, cc.v2(25.363, -217.64));
        this.node.runAction(movTo);
        var rTo = cc.rotateTo(speed, 364);//第一个参数也是时间参数，将节点旋转180°
        this.node.runAction(rTo);
        var scTo = cc.scaleTo(speed, 0.65);//将节点缩放到2倍
        this.node.runAction(scTo);
        this.bookMark.active = false;
        var faTo = cc.fadeTo(speed, 255);
        this.light.runAction(faTo);

    }

    playAudio(){
        this.audio.playAudio("openBook");
    }

   

}

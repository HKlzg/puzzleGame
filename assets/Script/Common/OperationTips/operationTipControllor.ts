
import settingBasic from "../../Setting/settingBasic";
const { ccclass, property } = cc._decorator;
const actionType = settingBasic.setting.actionType;
const actionDirection = settingBasic.setting.actionDirection;

class operateDataType {
    pic: cc.SpriteFrame;
    picName: string;
    tip: string;
    [index: number]: number;
    constructor(pic: cc.SpriteFrame, picName: string, tip: string) {
        this.pic = pic;
        this.picName = picName;
        this.tip = tip;
    }
}

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    tipNode: cc.Node = null;
    @property(cc.Node)
    preBt: cc.Node = null;
    @property(cc.Node)
    nextBt: cc.Node = null;
    @property(cc.Node)
    closeBt: cc.Node = null;
    @property(cc.Node)
    picNode: cc.Node = null;

    @property(cc.SpriteFrame)
    pictures: Array<cc.SpriteFrame> = [];

    step: number = 0;
    canvas: cc.Node = null;
    operationRecorder: Array<operateDataType> = [];

    currPage: number = -1;
    tipsList: {} = {}; //根据图片 设置提示文字 pic-tip对应
    start() {
        this.canvas = cc.find("Canvas")

        this.pictures.forEach((pic) => {
            this.operationRecorder.push(new operateDataType(pic, pic.name, this.tipsList[pic.name] ? this.tipsList[pic.name] : ""));
        })
        this.nextTip();
    }

    // update (dt) {}
    // onEnable() {
    //     cc.director.pause();
    // }
    onDisable() {
        cc.director.resume();
    }

    nextTip() {
        // console.log("====nextTip======" + this.currPage)
        if (this.operationRecorder.length > 0 && this.currPage < this.operationRecorder.length - 1) {
            let data: operateDataType = this.operationRecorder[this.currPage + 1];
            if (data) {
                // console.log("====nextTip====pic.name==" + data.pic.name)
                this.picNode.getComponent(cc.Sprite).spriteFrame = data.pic;
                this.picNode.setContentSize(500, 600)
                this.tipNode.getComponent(cc.Label).string = data.tip;
                this.operationRecorder[this.currPage + 1] ? this.currPage++ : null;
            }
        }
    }

    preTip() {
        // console.log("====preTip======" + this.currPage)
        if (this.operationRecorder.length > 0 && this.currPage > 0) {
            let data: operateDataType = this.operationRecorder[this.currPage - 1];
            if (data) {

                this.picNode.getComponent(cc.Sprite).spriteFrame = data.pic;
                this.picNode.setContentSize(500, 600)
                this.tipNode.getComponent(cc.Label).string = data.tip;
                this.operationRecorder[this.currPage - 1] ? this.currPage-- : null;
            }
        }
    }

    closeTip() {
        cc.director.resume();

        let pos = this.node.position;
        console.log("====closeTip======")
        cc.tween(this.node).to(0.5, { position: cc.v2(pos.x - 1000, pos.y) }).call(() => {
            // console.log("===22=closeTip======" + cc.director.isPaused())
            this.canvas.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.RESUME);
            settingBasic.fun.closeOperationGuide();
            this.node.active = false;
        }).start()

    }

}

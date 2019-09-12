import settingBasic from "../Setting/settingBasic";
import toolsBasics from "../Tools/toolsBasics";

const { ccclass, property } = cc._decorator;

//顺序和 content 的子节点一致
const contentType = cc.Enum({
    operationTips: 0,
    page_1: 1,
    page_2: 2,
    page_3: 3,
    page_4: 4,
    page_5: 5,
    items: 6,
    achievement: 7,
})

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Node)
    UIMask: cc.Node = null;

    @property(cc.Node)
    mapPicCopy: cc.Node = null;

    sceneList: cc.Node[] = [];
    contentList: Array<cc.Node> = []
    isContentMapClick: boolean = true; //当前图片是否可点击

    // LIFE-CYCLE CALLBACKS:

    UICamera: cc.Node = null;
    currScene: cc.Node = null;
    currPageNum: number = 1; //对应 contentType 1-5 (关卡) //游戏打开默认显示第一页

    canvas: cc.Node = null;
    UIAudioResorce = toolsBasics.getUIAudioManager();
    onLoad() {
        // console.log("===bookMark onLoad====")
        //从canvas 获取加载的scenelist
        this.canvas = cc.find("Canvas");
        this.sceneList = this.canvas.getComponent("CanvasControllor").getSceneList();
        if (this.sceneList) {
            this.currScene = this.sceneList[0];
            // this.loadSceneNode(0);
        }
        this.UICamera = this.UIMask.getChildByName("UICamera");
        this.contentList = this.contentNode.children;
    }

    start() {

    }
    update(dt) {
        if (!this.sceneList) {
            this.sceneList = this.canvas.getComponent("CanvasControllor").getSceneList();
            this.currScene = this.sceneList[0];
            // this.loadSceneNode(0);
        }
    }
    // 点击 故事内容 图片 ,开始游戏
    contentMapPicOnclik() {
        if (this.isContentMapClick) {
            // console.log("===currLevel=" + settingBasic.game.currLevel + " ==currPageNum= " + this.currPageNum)

            this.loadSceneNode(this.currPageNum - 1);
            //开始/继续游戏
            let state = 0;
            if (settingBasic.game.currLevel == this.currPageNum) {
                state = settingBasic.setting.stateType.RESUME;
            } else {
                state = settingBasic.setting.stateType.READY;
            }
            // console.log("==currScene= " + this.currScene.name + "   content=" + this.contentList[this.currPageNum].name)
            this.currScene.emit(settingBasic.gameEvent.gameStateEvent, state);

            if (this.contentList[this.currPageNum]) {
                let currPagePic: cc.Node = this.contentList[this.currPageNum].getChildByName("PicStory");
                //mapPicCopy更换为当前页面的图片
                if (!this.mapPicCopy.getComponent(cc.Sprite).spriteFrame) {
                    this.mapPicCopy.getComponent(cc.Sprite).spriteFrame = currPagePic.getComponent(cc.Sprite).spriteFrame;
                } else if (this.mapPicCopy.getComponent(cc.Sprite).spriteFrame != currPagePic.getComponent(cc.Sprite).spriteFrame) {
                    this.mapPicCopy.getComponent(cc.Sprite).spriteFrame = currPagePic.getComponent(cc.Sprite).spriteFrame;
                }
            }

            this.isContentMapClick = false;
            this.mapPicCopy.active = true;

            this.mapPicCopy.runAction(cc.fadeTo(1, 0));
            this.UIMask.getComponent(cc.Mask).enabled = true;

            cc.tween(this.UIMask)
                .to(1, { width: 4577, height: 4000 })
                .call(() => {
                    this.UIMask.active = false;
                })
                .start();
        }
    }
    // 点击 bookMenu 菜单 --暂停游戏
    bookOnClick() {
        // console.log("================bookOnClick===========" + settingBasic.game.currScene + "  " + settingBasic.game.currLevel)
        this.UIMask.active = true;
        cc.tween(this.UIMask)
            .to(1, { width: 388, height: 236.1 })
            .start();

        cc.tween(this.mapPicCopy).delay(0.5).then(cc.fadeIn(0.5)).call(() => {
            this.UIMask.getComponent(cc.Mask).enabled = false;
            cc.tween(this.mapPicCopy).then(cc.fadeOut(0.5)).call(() => {
                this.mapPicCopy.active = false;
                this.isContentMapClick = true;

                //暂停游戏
                this.currScene.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.PAUSE)

                if (settingBasic.game.State == settingBasic.setting.stateType.NEXT) {
                    this.nextPageContent()
                }

            }).start();
        }).start();

    }

    //设置pic 为可点击状态
    public showBookMark() {
        this.isContentMapClick = true;
    }

    //==============点击 书签================
    operationMarkOnclick() {
        this.showContent(contentType.operationTips)
    }
    storyMarkOnClick() {
        this.showContent(this.currPageNum);
    }
    achievementMarkOnClick() {
        this.showContent(contentType.achievement);
    }
    mapMarkOnClick() {
        this.showContent(contentType.items);
    }
    exitMarkClick() {
        this.node.parent.getComponent("bookAnimControllor").closeBook();
    }

    //=============翻页======相当于选择关卡============
    prePageContent() { //上一页
        this.currPageNum--;
        this.currPageNum = this.currPageNum > 1 ? this.currPageNum : 1;
        let currLv = --settingBasic.game.currLevel;
        this.showContent(currLv);

    }
    public nextPageContent() {//下一页
        // console.log("===1==" + this.currPageNum)
        this.currPageNum++;
        this.currPageNum = this.currPageNum < 5 ? this.currPageNum : 5;
        let currLv = ++settingBasic.game.currLevel;
        this.showContent(currLv);
        // console.log("===2==currLv " + currLv)
    }
    // 显示content 对应的内容
    showContent(contentId: number) {
        for (let index = 0; index < this.contentList.length; index++) {
            this.contentList[index].active = index == contentId;
        }
    }
    //切换scenelist 0-4
    loadSceneNode(id: number) {
        // this.currScene.active = false;

        for (let index = 0; index < this.sceneList.length; index++) {
            if (id == index) {
                this.currScene = this.sceneList[index];
                //先更改全局currScene,再激活currScene
                settingBasic.game.currScene = this.sceneList[index].name;
                this.currScene.active = true;
            } else {
                this.sceneList[index].active = false;
            }
        }
        // console.log("===2===id== " + id + " ====scene name = " + this.currScene.name)
    }

    //重玩当前关卡
    restartCurrLevel() {
        let index = settingBasic.game.currLevel;
        //回调
        let self = this;
        let callBack = function (scene) {
            if (scene) {
                self.sceneList[index - 1] = scene;
                self.currScene = scene;
                self.currScene.active = true;
                console.log("===重新加载====:" + scene.name);
            }
        }
        this.canvas.getComponent("CanvasControllor").getSceneByCurrLv(callBack);
    }



}

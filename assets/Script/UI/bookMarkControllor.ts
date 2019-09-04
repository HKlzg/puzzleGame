import settingBasic from "../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

//顺序和 content 的子节点一致
const contentType = cc.Enum({
    operationTips: 0,
    page_1: 1,
    page_2: 2,
    page_3: 3,
    page_4: 4,
    page_5: 5,
    map: 6,
    achievement: 7,
})

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    contentNode: cc.Node = null;
    contentList: Array<cc.Node> = []

    @property(cc.Node)
    UIMask: cc.Node = null;

    @property(cc.Node)
    mapPicCopy: cc.Node = null;

    @property(cc.Node)
    sceneList: cc.Node[] = [];
    isContentMapClick: boolean = true; //当前图片是否可点击

    // LIFE-CYCLE CALLBACKS:

    UICamera: cc.Node = null;
    currScene: cc.Node = null;
    currPageNum: number = 1; //对应 contentType 1-5 (关卡) //游戏打开默认显示第一页

    onLoad() {
        // console.log("===bookMark onLoad====")
        this.currScene = this.sceneList[0];
        this.UICamera = this.UIMask.getChildByName("UICamera");
        this.contentList = this.contentNode.children;
        this.loadSceneNode(this.currPageNum - 1);
    }

    start() {
    }

    // 点击 故事内容 图片 ,开始游戏
    contentMapPicOnclik() {
        if (this.isContentMapClick) {
            console.log("===currLevel=" + settingBasic.game.currLevel + " ==currPageNum= " + this.currPageNum)

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
                this.mapPicCopy.getComponent(cc.Sprite).spriteFrame = currPagePic.getComponent(cc.Sprite).spriteFrame;
            }

            this.isContentMapClick = false;
            this.mapPicCopy.active = true;
            this.mapPicCopy.getComponent(cc.Button).enabled = false;

            this.mapPicCopy.runAction(cc.fadeTo(1.5, 0));
            this.UIMask.getComponent(cc.Mask).enabled = true;

            cc.tween(this.UIMask)
                .to(1.5, { width: 4577, height: 4000 })
                .call(() => {

                })
                .start();
        }
    }
    //点击 bookMenu 菜单 --暂停游戏
    bookOnClick() {
        // console.log("=================click=bookMenu===========" + settingBasic.game.currScene + "  " + settingBasic.game.currLevel)

        cc.tween(this.UIMask)
            .to(1, { width: 388, height: 236.1 })
            .start();

        cc.tween(this.mapPicCopy).delay(0.5).then(cc.fadeIn(0.5)).call(() => {
            this.UIMask.getComponent(cc.Mask).enabled = false;
            cc.tween(this.mapPicCopy).then(cc.fadeOut(0.5)).call(() => {
                this.mapPicCopy.active = false;
                this.isContentMapClick = true;
                this.mapPicCopy.getComponent(cc.Button).enabled = true;

                //暂停游戏
                this.currScene.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.PAUSE)
                if (settingBasic.game.State == settingBasic.setting.stateType.NEXT) {
                    this.nextPageContent()
                }

            }).start();
        }).start();

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
        this.showContent(contentType.map);
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
    nextPageContent() {//下一页
        this.currPageNum++;
        this.currPageNum = this.currPageNum < 5 ? this.currPageNum : 5;
        let currLv = ++settingBasic.game.currLevel;
        this.showContent(currLv);

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

                this.sceneList[index].active = true;
                settingBasic.game.currScene = this.sceneList[index].name;
                this.currScene = this.sceneList[index];

            } else {
                this.sceneList[index].active = false;
            }
        }
        // console.log("===2===id== " + id + " ====scene name = " + this.currScene.name + "  this.UIMask= " + this.UICamera.parent.active)
    }

    update(dt) {

    }


}

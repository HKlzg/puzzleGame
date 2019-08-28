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
    bookMenu: cc.Node = null;

    isContentMapClick: boolean = true; //当前图片是否可点击

    // LIFE-CYCLE CALLBACKS:

    UICamera: cc.Node = null;
    canvas: cc.Node = null;
    currPageNum: number = 1; //对应 contentType 1-5  //游戏打开默认显示第一页
    // onLoad (){}

    start() {
        this.canvas = cc.find("Canvas");
        this.UICamera = this.UIMask.getChildByName("UICamera")
        this.contentList = this.contentNode.children;
    }

    // 点击 故事内容 图片 ,开始游戏
    contentMapPicOnclik() {
        if (this.isContentMapClick) {
            //开始/继续游戏
            let state = settingBasic.game.State == settingBasic.setting.stateType.READY ?
                settingBasic.setting.stateType.START :
                settingBasic.game.State == settingBasic.setting.stateType.PAUSE ?
                    settingBasic.setting.stateType.RESUME :
                    settingBasic.setting.stateType.RESUME;

            this.canvas.emit(settingBasic.gameEvent.gameStateEvent, state);

            let currPagePic: cc.Node = this.contentList[this.currPageNum].getChildByName("PicStory");
            //mapPicCopy更换为当前页面的图片
            this.mapPicCopy.getComponent(cc.Sprite).spriteFrame = currPagePic.getComponent(cc.Sprite).spriteFrame;

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
                // this.canvas.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.PAUSE)

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

    //=============翻页==================
    prePageContent() { //上一页
        this.currPageNum--;
        this.currPageNum = this.currPageNum > 1 ? this.currPageNum : 1;
        this.showContent(this.currPageNum);

    }
    nextPageContent() {//下一页
        this.currPageNum++;
        this.currPageNum = this.currPageNum < 5 ? this.currPageNum : 5;
        this.showContent(this.currPageNum);
    }
    // 显示content 对应的内容
    showContent(contentId: number) {
        for (let index = 0; index < this.contentList.length; index++) {
            this.contentList[index].active = index == contentId;
        }
    }

    update(dt) {


    }
}

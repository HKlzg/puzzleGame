
const { ccclass, property } = cc._decorator;
import toolsBasics from "../Tools/toolsBasics";
import settingBasic from "../Setting/settingBasic";
import { LogicBasicComponent } from "./LogicBasic/LogicBasicComponent";

const leveList = settingBasic.setting.level

@ccclass
export abstract class ViewControllorBasic extends LogicBasicComponent {

    @property({ type: cc.Enum(leveList), displayName: "关卡设定" })
    public level = leveList.lv1;
    @property(cc.Node)
    cameraNode: cc.Node = null;
    @property(cc.Node)
    UICamera: cc.Node = null;
    @property(cc.Node)
    brotherNode: cc.Node = null;

    //Brother Move 
    minX: number = 0;
    minY: number = 0;
    maxX: number = 0;
    maxY: number = 0;

    bookNode: cc.Node = null;
    bookmarkNode: cc.Node = null;

    public blackMask: cc.Node = null;

    //public 用于给子类调用
    public boxParent: cc.Node = null;
    public toolsBasics = toolsBasics;
    public settingBasic = settingBasic;
    public stateType = settingBasic.setting.stateType;

    public stepList: Array<string> = [];
    public preGameState = 0;
    public deathTip: cc.Label = null;
    public audioManager = toolsBasics.getAudioManager();
    public brotherWalkNode: cc.Node = null;
    public actionType = settingBasic.setting.actionType;

    isSetAudio: boolean = false;
    personAudio: [{ actionType: number, name: string }] = null;

    onLoad() {
        // cc.game.setFrameRate(60);
        this.brotherWalkNode = this.brotherNode.getChildByName("Brother_Walk");

        // 自定义事件 控制游戏状态 
        this.node.on(settingBasic.gameEvent.gameStateEvent, this.changeGameState, this);
        this.node.on(settingBasic.gameEvent.gameStepEvent, this.gameStep, this);
        this.node.on(settingBasic.gameEvent.gameMoveStep, this.moveStep, this);
        this.node.on(settingBasic.gameEvent.setCurrGameStep, this.setCurrGameStep, this);

        this.UICamera.parent.active = true;
        this.deathTip = this.UICamera.getChildByName("deathTip").getComponent(cc.Label);
        let currDeath = settingBasic.game.currDeath;
        this.deathTip.string = "失败次数:" + currDeath;
        this.blackMask = this.cameraNode.getChildByName("blackMask")

        //书签
        this.bookNode = this.UICamera.getChildByName("bookNode");
        this.bookmarkNode = this.bookNode.getChildByName("bookmark");

        //在书本翻页之后 再次初始化时 为暂停状态 此时设置书本菜单为打开状态
        if (settingBasic.game.State == settingBasic.setting.stateType.PAUSE) {
            this.bookNode.getComponent("bookAnimControllor").openBookImmediately();
        }

        console.log("=========SCENE: " + this.level + " ==========")
        settingBasic.game.currLevel = this.level;
        settingBasic.fun.setScene("level_" + this.level, cc.director.getScene());

        //加载子包资源
        this.loadSubPackageDefualt();

        //开启物理系统 ----------必须写在onLoad 里面
        cc.director.getPhysicsManager().enabled = true;

        // 绘制碰撞区域
        var draw = cc.PhysicsManager.DrawBits;
        // cc.director.getPhysicsManager().debugDrawFlags = draw.e_shapeBit | draw.e_jointBit;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true; //碰撞区域 
        // 开启碰撞检测
        cc.director.getCollisionManager().enabled = true;

    };

    start() {
        //test
        this.toStart();

        this.changeGameState(settingBasic.setting.stateType.START);

        if (settingBasic.game.State == settingBasic.setting.stateType.PAUSE) {
            settingBasic.fun.loadGameRecord();
        }
        this.changeGameState(settingBasic.setting.stateType.PAUSE)

    };


    //子类实现
    abstract toStart();

    //#endregion
    logicUpdate(dt) {

        this.toUpdate();
        if (this.personAudio && this.brotherWalkNode.hasEventListener(settingBasic.gameEvent.brotherSetAudio) && !this.isSetAudio) {
            this.brotherWalkNode.emit(this.settingBasic.gameEvent.brotherSetAudio, this.personAudio);
            this.isSetAudio = true;
        }
    };

    //设置人物 动作对应的音效
    setPersonAudioName(msg: [{ actionType: number, name: string }]) {
        this.personAudio = msg;
    };
    abstract toUpdate();

    loadSubPackageDefualt() {
        //加载资源 子包
        // cc.loader.downloader.loadSubpackage('Audio', function (err) {
        //     if (err) {
        //         return console.error("----Audio---------" + err);
        //     }
        // });

        this.loadSubPackage();
    };
    //子类实现之后 加载额外的子包
    abstract loadSubPackage();

    //更改当前游戏状态
    changeGameState(state) {
        settingBasic.game.State = state;

        switch (state) {
            case this.stateType.READY:
                console.log("==========GAME READY==========")
                break;
            case this.stateType.START:
                console.log("==========GAME START==========")

                this.blackMask.active = true;

                this.blackMask.runAction(
                    cc.sequence(
                        cc.fadeOut(2),
                        cc.callFunc(() => {
                            this.blackMask.active = false;
                        })
                    )
                );

                break;
            case this.stateType.NORMAL:
                console.log("==========GAME NORMAL==========")
                break;
            case this.stateType.NEXT:
                console.log("==========GAME NEXT==========")
                //回到书本菜单    
                let nextLevel = this.level + 1;
                //开启引导镜头
                settingBasic.fun.openShowKeyPos();

                if (settingBasic.setting.level[nextLevel]) {
                    settingBasic.game.currLevel = nextLevel;
                } else {
                    settingBasic.game.currLevel = -1; //通关
                }

                let bookmarkCtrl = this.bookmarkNode.getComponent("bookMarkControllor");
                bookmarkCtrl.bookOnClick(); //回到UI菜单
                // cc.director.loadScene("loading")
                break;

            case this.stateType.PAUSE:
                console.log("==========GAME PAUSE==========")

                // cc.director.pause();
                this.audioManager.setEnablePlay(false);

                //存储当前游戏状态
                // settingBasic.fun.saveGameRecord();

                break;
            case this.stateType.RESUME:
                console.log("==========GAME RESUME==========")
                // cc.director.resume();
                this.audioManager.setEnablePlay(true);
                //还原游戏状态
                // settingBasic.fun.loadGameRecord();
                break;
            case this.stateType.REBORN:
                //只能连续死一次
                if (this.preGameState == this.stateType.REBORN) return;

                this.brotherNode.emit(settingBasic.gameEvent.brotherDeathEvent, true);
                //记录死亡次数
                let currDeath = settingBasic.fun.addCurrDeath(this.level)
                this.deathTip.string = "失败次数: " + currDeath;

                console.log("=======GameState===REBORN==========")

                break;
            case this.stateType.RESTART:
                console.log("==========GAME RESTART =========")

                //关闭 引导镜头
                settingBasic.fun.closeShowKeyPos();

                this.blackMask.active = true;
                this.blackMask.runAction(
                    cc.sequence(
                        cc.fadeIn(2),
                        cc.callFunc(() => {
                            cc.director.loadScene("level_" + this.level)
                        })
                    )
                );

                break;
            default:
                break;
        }
        //记录上一个状态
        this.preGameState = state;
    }
    //记录当前移动的
    setCurrGameStep(step: string) {
        this.stepList.push(step);
    };

    //开启游戏机关 步骤
    abstract gameStep(setp: string);
    //人物移动步骤
    abstract moveStep(setp: number);



    //写入资料到本地 / 上传资料
    onDestroy() {

    }
}

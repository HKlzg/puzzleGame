
const { ccclass, property } = cc._decorator;
import toolsBasics from "../Tools/toolsBasics";
import settingBasic from "../Setting/settingBasic";
import { LogicBasicComponent } from "./LogicBasic/LogicBasicComponent";
import AchievementControllor from "./Achievement/achievementControllor";
import audioSetting from "./Audio/audioSetting";
import { gameRecordClass } from "./BasicClass/recordClass";

const leveList = settingBasic.setting.level

@ccclass
export abstract class ViewControllorBasic extends LogicBasicComponent {

    @property({ type: cc.Enum(leveList), displayName: "关卡设定" })
    public level = leveList.lv1;
    @property(cc.Node)
    cameraNode: cc.Node = null;
    @property(cc.Node)
    brotherNode: cc.Node = null;
    UICamera: cc.Node = null;

    bookNode: cc.Node = null;
    bookmarkNode: cc.Node = null;
    canvas: cc.Node = null;
    public blackMask: cc.Node = null;

    //public 用于给子类调用
    public boxParent: cc.Node = null;
    public toolsBasics = toolsBasics;
    public settingBasic = settingBasic;
    public stateType = settingBasic.setting.stateType;

    public stepList: Array<string> = [];
    public preGameState = 0;
    // public deathTip: cc.Label = null;
    public audioManager: any = null;
    public brotherWalkNode: cc.Node = null;
    public actionType = settingBasic.setting.actionType;
    public achieveManager = AchievementControllor.getAchieveManager();
    public achieveTypes = settingBasic.setting.achievements;


    isSetAudio: boolean = false;
    isRestarting: boolean = false;
    personAudio: [{ actionType: number, name: string }] = null;
    onLoad() {
        this.canvas = cc.find("Canvas");
        this.audioManager = cc.find("UICamera/audio").getComponent("audioControllor");
        // cc.game.setFrameRate(60);
        this.brotherWalkNode = this.brotherNode.getChildByName("Brother_Walk");

        // 自定义事件 控制游戏状态 
        this.node.on(settingBasic.gameEvent.gameStateEvent, this.changeGameState, this);
        this.node.on(settingBasic.gameEvent.gameStepEvent, this.gameStep, this);
        this.node.on(settingBasic.gameEvent.gameMoveStep, this.moveStep, this);
        this.node.on(settingBasic.gameEvent.setCurrGameStep, this.setCurrGameStep, this);

        this.UICamera = cc.find("UIMask").getChildByName("UICamera") //UIMask下面的camera
        // this.deathTip = this.UICamera.getChildByName("deathTip").getComponent(cc.Label);

        this.blackMask = cc.find("UICamera").getChildByName("blackMask")

        //书签
        this.bookNode = this.UICamera.getChildByName("bookNode");
        this.bookmarkNode = this.bookNode.getChildByName("bookmark");
        this.audioManager.setCurrScene();
        //加载子包资源
        this.loadSubPackageDefualt();

        //开启物理系统 ----------必须写在onLoad 里面
        let manager = cc.director.getPhysicsManager();
        manager.enabledAccumulator = true;
        manager.enabled = true;
        // 开启碰撞检测
        cc.director.getCollisionManager().enabled = true;

        // 绘制碰撞区域
        // var draw = cc.PhysicsManager.DrawBits;
        // cc.director.getPhysicsManager().debugDrawFlags = draw.e_shapeBit | draw.e_jointBit;
        // cc.director.getCollisionManager().enabledDebugDraw = true; //碰撞区域 
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true;


    };
    onEnable() {
        console.log("======Curr===SCENE: " + this.level + " ==========")
        settingBasic.game.currLevel = this.level;
        settingBasic.game.currScene = this.node.name;
    }

    start() {
        let currBgm = audioSetting.fun.getCurrList().BGM;
        // console.log("======currBgm : " + currBgm + " ==========")
        this.audioManager.playLoopBGM(currBgm);
        //test
        this.toStart();
        //读取信息
        let rec: gameRecordClass = this.canvas.getComponent("CanvasControllor").getGameRecords();
        if (rec.levelRecord["lv" + this.level]) {
            this.changeGameState(settingBasic.setting.stateType.START);
        } else {
            this.changeGameState(settingBasic.setting.stateType.PAUSE);
        }

    };


    //子类实现
    abstract toStart();

    //#endregion
    logicUpdate(dt) {
        this.toUpdate();
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

                let bookmarkCtrl = this.bookmarkNode.getComponent("bookMarkControllor");
                bookmarkCtrl.bookOnClick(); //回到UI菜单
                break;

            case this.stateType.PAUSE:
                console.log("==========GAME PAUSE==========")

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
            case this.stateType.REBORN: //取消此状态
                //只能连续死一次
                if (this.preGameState == this.stateType.REBORN) return;

                this.brotherNode.emit(settingBasic.gameEvent.brotherDeathEvent, true);
                // //记录死亡次数
                // let currDeath = settingBasic.fun.addCurrDeath(this.level)

                console.log("=======GameState===REBORN==========")

                break;
            case this.stateType.RESTART: //人物死亡之后调用 
                if (this.isRestarting) return;
                this.isRestarting = true;
                console.log("==========GAME RESTART =========")
                //播放人物死亡动画
                this.changeGameState(this.stateType.REBORN);

                this.blackMask.active = true;
                this.blackMask.runAction(
                    cc.sequence(
                        cc.fadeIn(2),
                        cc.callFunc(() => {
                            let bookmarkCtrl = this.bookmarkNode.getComponent("bookMarkControllor");
                            //关闭所有音效
                            this.audioManager.stopEffects();
                            //重新开始当前关卡
                            bookmarkCtrl.restartCurrLevel();
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

   

}

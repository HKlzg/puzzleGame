
const settingBasic = {

    setting: {
        //每一帧的蓄力 
        strengthStep: 150,
        //最大蓄力值
        strengthMax: 5000,
        //弦最大拉伸距离 相对父坐标
        chordMax: -50,
        //角色偏转最大角度
        rotationMax: 45,
        //运行状态枚举值
        stateType: cc.Enum({
            START: 1,
            NEXT: 2, //下一关
            PAUSE: 3,
            RESUME: 4,
            REBORN: 5,//重生
            NORMAL: 6
        }),
        //角色枚举值
        roleState: cc.Enum({
            Stop: 0,
            Moving: 1,
            LongTouch: 2
        }),
        //设定每关箱子的数量
        boxNum: {
            lv1: 2,
            lv2: 2,
            lv3: 10,
            lv4: 10,
            lv5: 10,
            lv6: 50,
            lv7: 50,
            lv8: 50,
        },
        //等级枚举 枚举值 只能是数字
        level: cc.Enum({
            lv1: 1,
            lv2: 2,
            lv3: 3,
            lv4: 4,
            lv5: 5,
            lv6: 6,
            lv7: 7,
            lv8: 8,
        }),
        //人物动作枚举值
        actionType: cc.Enum({
            Wait: 1,
            Walk: 2,
            Jump: 3,
            Climb: 4,
            MAGIC: 5,
            No_Magic: 6,
            ClimbBox: 7,
            ReadyPush: 8,
            Push: 9,
            QuietlyWalk: 10, //悄悄走
        }),
        //人物动作方向
        actionDirection: cc.Enum({
            Left: 1,
            Right: 2,
            Up: 3,
            Down: 4,
            Up_Left: 5,
            Up_Right: 6,
            Down_Right: 7,
            Down_left: 8,
        }),

    },



    fun: {
        getBoxNumByLv(lv) {
            let setting = settingBasic.setting.boxNum;
            let num = setting["lv" + lv];
            return num;
        },
        //记录场景
        setScene(name: string, scene: cc.Scene) {
            let list = settingBasic.game.sceneList;
            if (!list[name]) {
                list[name] = scene;
            }
            // console.log("----------------sceneList name: " + name)
        },

        getSceneByName(name: string) {
            let list = settingBasic.game.sceneList;
            return list[name] ? list[name] : null;
        },

        nextScene() {
            let level = settingBasic.game.currLevel;
            let name = "level_" + (level + 1);
            cc.director.loadScene(name);

        },
        reLoade() {
            let name = "level_" + settingBasic.game.currLevel;
            cc.director.loadScene(name)
        },

        /**
         * 记录当前关卡死亡数
         */
        addCurrDeath(lv: number): number {
            settingBasic.game.currDeath++;
            settingBasic.game.totalDeath++;
            settingBasic.game.deathRecord[lv] = settingBasic.game.currDeath;
            settingBasic.game.deathRecord["total"] = settingBasic.game.totalDeath;
            return settingBasic.game.currDeath;
        },
        clearCurrDeath() {
            settingBasic.game.currDeath = 0;
        },

    },

    //当前游戏运行状态 全局
    game: {
        State: 1,
        currLevel: 0,
        currBoxNum: 0,
        currDeath: 0, //当前关卡死亡数
        totalDeath: 0, //游戏死亡总数
        sceneList: {},
        deathRecord: {},//死亡记录 用于存档
    },

    //自定义事件
    gameEvent: {
        //----游戏状态事件------viewControllorBasic------------------------
        gameStateEvent: "gameStateEvent",
        //----游戏关卡开启步骤
        gameStepEvent: "gameStepEvent",
        gameMoveStep: "brotherMoveStep",
        setCurrGameStep: "setCurrGameStep",
        //----brotherControllor---- Action
        brotherActionEvent: "brotherActionEvent",
        brotherPlayState: "brotherPlayState",
        brotherJumpEvent: "brotherJumpEvent",
        brotherDeathEvent: "brotherDeathEvent",
        brotherSetBornPos: "brotherSetBornPos",
        brotherSetAudio: "brotherSetAudio",
        getBrotherAction: "getBrotherAction",
        //backGround
        //Box
        instanceBoxEvent: "instanceBoxEvent",
        //Circle
        changeCircleColor: "changeCircleColor",
        //lv3 monster
        monsterAction: "monsterAction",
        monsterReduceState: "monsterReduceState",
        monsterStopPlayAction: "monsterStopPlayAction",

    },


};


export default settingBasic;

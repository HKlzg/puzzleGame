
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
            READY: 0, //准备
            START: 1,
            NEXT: 2, //下一关
            PAUSE: 3,
            RESUME: 4,
            REBORN: 5,//重生
            NORMAL: 6,
            RESTART: 7,
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
            lv3: 2,
            lv4: 2,
            lv5: 2,
            lv6: 2,
            lv7: 2,
            lv8: 2,
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

        //可控制的道具类型
        itemType: cc.Enum({
            flower: 0,
            gear: 1,
            tear: 2
        }),

        //成就类别设定
        achievements: {
            lv1: cc.Enum({
                TimeCollector: 0,
                SadnessMessenger: 1,
            }),
            lv2: cc.Enum({
                StomachLover: 0,
                IAmWaterGhost: 1,
            }),
            lv3: cc.Enum({
                EscapeFromTigerMouth: 0,
                IAmFood: 1,
                CuteTiger: 2,
            }),
            lv4: cc.Enum({
                SpiderHunter: 0,
                Slowly: 1,
                Overnight: 2,
            }),
            lv5: cc.Enum({
                GraceOfTheEarth: 0,
                MomentsOfEternal: 1,
                TheDeadUnderTheFist: 2,
                Smartboy: 3,
            }),
        },
        //数组顺序和 achievements 对应 //初始值，用于初始化
        achievementsInit: {
            lv1: [
                { type: 0, name: "采时者", isGet: false, count: 0, needNum: 1 },
                { type: 1, name: "悲伤的使者", isGet: false, count: 0, needNum: 1 }
            ],
            lv2: [
                { type: 0, name: "鱼腹爱好者", isGet: false, count: 0, needNum: 5 },
                { type: 1, name: "我是水鬼", isGet: false, count: 0, needNum: 3 }
            ],
            lv3: [
                { type: 0, name: "虎口脱险", isGet: false, count: 0, needNum: 3 },
                { type: 1, name: "我是食物", isGet: false, count: 0, needNum: 3 },
                { type: 2, name: "乖乖虎", isGet: false, count: 0, needNum: 1 },
            ],
            lv4: [
                { type: 0, name: "蜘蛛猎人", isGet: false, count: 0, needNum: 1 },
                { type: 1, name: "慢吞吞的", isGet: false, count: 0, needNum: 1 },
                { type: 2, name: "一蹴而就", isGet: false, count: 0, needNum: 1 },
            ],
            lv5: [
                { type: 0, name: "大地的恩泽", isGet: false, count: 0, needNum: 1 },
                { type: 1, name: "生命永恒", isGet: false, count: 0, needNum: 1 },
                { type: 2, name: "锤下亡魂", isGet: false, count: 0, needNum: 1 },
                { type: 3, name: "机灵鬼", isGet: false, count: 0, needNum: 3 },
            ],
        }

    },



    fun: {

        getBoxNumByLv(lv) {
            let setting = settingBasic.setting.boxNum;
            let num = setting["lv" + lv];
            return num;
        },
        //获取指定关卡的成就
        getAchievementByLv(lv) {
            let achieve = settingBasic.setting.achievements;
            return achieve["lv" + lv];
        },
        //获取成就名称
        getAchieveCN(lv: number, achieveType: number) {
            let achievements = settingBasic.setting.achievementsInit;
            return achievements["lv" + lv][achieveType].name;
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
        //显示引导镜头
        openShowKeyPos() {
            settingBasic.game.isShowKeyPos = true;
        },
        //关闭引导镜头
        closeShowKeyPos() {
            settingBasic.game.isShowKeyPos = false;
        },
        //增加物品
        addItems(itemType: number) {
            let list = settingBasic.game.inventory;
            let hasItem = false;
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                if (element == itemType) {
                    hasItem = true;
                    return;
                }
            }
            if (!hasItem) {
                settingBasic.game.inventory.push(itemType);
            }
        },
        //存储当前游戏状态
        saveGameRecord() {
            //当前关卡存档
            let lvRecord: {} = {};
            lvRecord["currBoxNum"] = settingBasic.game.currBoxNum;
            lvRecord["currDeath"] = settingBasic.game.currDeath;
            lvRecord["isShowKeyPos"] = settingBasic.game.isShowKeyPos;

            let level_key = "currLevelRecords_lv" + settingBasic.game.currLevel;
            cc.sys.localStorage.setItem(level_key, JSON.stringify(lvRecord));

            //游戏总存档
            let gameRecord: {} = {};
            gameRecord["totalDeath"] = settingBasic.game.totalDeath;
            gameRecord["inventory"] = settingBasic.game.inventory;

            let game_key = "allGameRecords_" + settingBasic.game.version;
            cc.sys.localStorage.setItem(game_key, JSON.stringify(gameRecord));

        },
        //恢复当前游戏状态
        loadGameRecord() {
            let game_key = "allGameRecords_" + settingBasic.game.version;
            let level_key = "currLevelRecords_lv" + settingBasic.game.currLevel;

            if (settingBasic.game.isClearCurrRecord) {
                console.log("level_key==" + level_key + "  " + "remove")
                cc.sys.localStorage.removeItem(level_key);
            }
            if (settingBasic.game.isClearGameRecord) {
                console.log("game_key==" + level_key + "  " + "remove")
                cc.sys.localStorage.removeItem(game_key);
            }
            //当前关数据读取
            let lvRecordJson = cc.sys.localStorage.getItem(level_key);
            if (lvRecordJson) {
                let lvRecord = JSON.parse(lvRecordJson);
                if (lvRecord) {
                    settingBasic.game.currBoxNum = lvRecord["currBoxNum"];
                    settingBasic.game.currDeath = lvRecord["currDeath"];
                    settingBasic.game.isShowKeyPos = lvRecord["isShowKeyPos"];
                }
            }

            //游戏总存档读取
            let allGameRecordsJson = cc.sys.localStorage.getItem(game_key);

            if (allGameRecordsJson) {
                let allGameRecords = JSON.parse(allGameRecordsJson);
                if (allGameRecords) {
                    settingBasic.game.totalDeath = allGameRecords["totalDeath"];
                    settingBasic.game.inventory = allGameRecords["inventory"];
                }
            }
        },
    },

    //当前游戏运行状态 全局
    game: {
        State: 0,
        currLevel: 1, //初始值
        currBoxNum: 0,
        currDeath: 0, //当前关卡死亡数
        totalDeath: 0, //游戏死亡总数
        deathRecord: {},//死亡记录 用于存档
        isShowKeyPos: false, //是否显示引导镜头
        inventory: [], //物品栏 //存储物品类别(number类型)
        isClearCurrRecord: false, //是否在reload 时清除当前关卡records
        isClearGameRecord: false, //是否在reload 时清除所有records

        version: "001",//版本号

        currScene: "Scene1",

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
        //Box
        instanceBoxEvent: "instanceBoxEvent",
        //Circle
        changeCircleColor: "changeCircleColor",
        //lv3 monster
        monsterReduceState: "monsterReduceState",
        monsterStopPlayAction: "monsterStopPlayAction",
        //
        jumpStartEvent: "jumpStartEvent",
        //itemBag
        getItemEvent: "getItemEvent",
    },


};


export default settingBasic;


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
            lv1: 0,
            lv2: 0,
            lv3: 0,
            lv4: 0,
            lv5: 0,
        },
        //等级枚举 枚举值 只能是数字
        level: cc.Enum({
            lv1: 1,
            lv2: 2,
            lv3: 3,
            lv4: 4,
            lv5: 5,

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

        item: {
            //物品种类
            id: cc.Enum({
                map_1: 1,
                map_2: 2,
                map_3: 3,
                map_4: 4,
                footPrints: 5,
                lv1_paper: 6,
                lv2_paper: 7,
                lv3_paper: 8,
                lv4_paper: 9,
            }),
            //物品名称 与 物品种类对应关系
            data: [
                {
                    id: 1, kind: "map", name: "map_1",
                    desc: "地图碎片",
                    isShow: false
                },
                {
                    id: 2, kind: "map", name: "map_2",
                    desc: "地图碎片",
                    isShow: false
                },
                {
                    id: 3, kind: "map", name: "map_3",
                    desc: "地图碎片",
                    isShow: false
                },
                {
                    id: 4, kind: "map", name: "map_4",
                    desc: "地图碎片",
                    isShow: false,
                },
                {
                    id: 5, kind: "item", name: "footprints",
                    desc: "这是森林深处魔兽的脚印，他们好像来村子，村民失踪肯定和他们有关系",
                    isShow: false,
                },
                {
                    id: 6, kind: "paper", name: "lv1_paper",
                    desc: "神秘纸条",
                    isShow: false,
                },
                {
                    id: 7, kind: "paper", name: "lv2_paper",
                    desc: "神秘纸条",
                    isShow: false,
                },
                {
                    id: 8, kind: "paper", name: "lv3_paper",
                    desc: "神秘纸条",
                    isShow: false,
                },
                {
                    id: 9, kind: "paper", name: "lv4_paper",
                    desc: "神秘纸条",
                    isShow: false,
                },
            ],

        },

        //成就类别设定
        achievements: cc.Enum({
            TimeCollector: 0,
            SadnessMessenger: 1,
            StomachLover: 2,
            IAmWaterGhost: 3,
            IAmFood: 4,
            CuteTiger: 5,
            SpiderHunter: 6,
            Slowly: 7,
            Overnight: 8,
            GraceOfTheEarth: 9,
            MomentsOfEternal: 10,
            TheDeadUnderTheFist: 11,
            Smartboy: 12,
        }),
        //数组顺序和 achievements 对应 //初始值，用于初始化
        achievementsInit: [
            {
                type: 0, name: "采时者",
                desc: "超过5分钟还没有灭火",
                isGet: false, count: 0, needNum: 1
            },
            {
                type: 1, name: "悲伤的使者",
                desc: "获取隐藏道具书页",
                isGet: false, count: 0, needNum: 1
            },
            {
                type: 2, name: "鱼腹爱好者",
                desc: "被鱼吃死5次",
                isGet: false, count: 0, needNum: 5
            },
            {
                type: 3, name: "我是水鬼",
                desc: "被水淹死3次",
                isGet: false, count: 0, needNum: 3
            },
            {
                type: 4, name: "我是食物",
                desc: "葬身虎口3次",
                isGet: false, count: 0, needNum: 3
            },
            {
                type: 5, name: "乖乖虎",
                desc: "成功捕捉老虎",
                isGet: false, count: 0, needNum: 1
            },
            {
                type: 6, name: "蜘蛛猎人",
                desc: "杀死蜘蛛",
                isGet: false, count: 0, needNum: 1
            },
            {
                type: 7, name: "慢吞吞的",
                desc: "被蜘蛛追上戳死",
                isGet: false, count: 0, needNum: 1
            },
            {
                type: 8, name: "一蹴而就",
                desc: "第一次玩当前关卡就通关",
                isGet: false, count: 0, needNum: 1
            },
            {
                type: 9, name: "大地的恩泽",
                desc: "释放了村子里面的人",
                isGet: false, count: 0, needNum: 1
            },
            {
                type: 10, name: "生命永恒",
                desc: "复活的生命之树",
                isGet: false, count: 0, needNum: 1
            },
            {
                type: 11, name: "锤下亡魂",
                desc: "被大地之王砸死",
                isGet: false, count: 0, needNum: 1
            },
            {
                type: 12, name: "机灵鬼",
                desc: "躲避石头三次",
                isGet: false, count: 0, needNum: 3
            },

        ],

        //存储到本地记录的 key 
        storageKey: {
            game: "puzzleGame",
            achievement: "achievementRecords",
            item: "itemStorageKey",
        }


    },



    fun: {

        getBoxNumByLv(lv) {
            let setting = settingBasic.setting.boxNum;
            let num = setting["lv" + lv];
            return num;
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

        //获取物品信息
        getItemByID(id: number) {
            let items = settingBasic.setting.item.data;
            for (let index = 0; index < items.length; index++) {
                if (items[index].id == id) {
                    return items[index];
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

        //进入下一关
        brotherTransitionEvent: "brotherTransitionEvent",

        brotherSetBornPos: "brotherSetBornPos",
        getBrotherAction: "getBrotherAction",

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

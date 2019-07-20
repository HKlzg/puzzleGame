
let settingBasic = {

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
            OVER: 5
        }),
        //角色枚举值
        roleType: cc.Enum({
            leadingRole: 1,
            assistant: 2
        }),
        //设定每关箭的数量
        boxNum: {
            lv1: 10,
            lv2: 50,
            lv3: 50,
            lv4: 50,
            lv5: 50,
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
    },



    fun: {
        getBoxNumByLv(lv) {
            let setting = settingBasic.setting.boxNum;
            let num = setting["lv" + lv];
            // console.log("===========setting " + lv + " num =" + num)

            return num;
        },
    },

    //当前游戏运行状态 全局
    game: {
        State: 1,
        currLevel: 0,
        currRole: 1
    },

    //自定义事件
    gameEvent: {
        //----游戏状态事件------viewControllorBasic------------------------
        gameStateEvent: "gameStateEvent",
        gameRoleEvent:"gameRoleEvent",
        //----游戏关卡开启步骤
        gameStepEvent: "gameStepEvent",
        gameMoveStep: "brotherMoveStep",
        setCurrGameStep: "setCurrGameStep",

        //----绳子---ropeConnectCtr--
        ropeOnBeginContact: "ropeOnBeginContact",

        //---箭---ArrowControllor---
        setArrowOffset: "setArrowOffset",
        setArrowPropertys: "setArrowPropertys",

        //---弓---bowContrpllor----------
        setBowsSring: "setBowsSring",

        //----梯子 ladderContrpllor----------
        ladderActionEvent: "ladderActionEvent",

        //----brotherControllor---- Action
        brotherActionEvent: "brotherActionEvent",
        //----bear3Controllor---- Action
        bearActionEvent: "bearActionEvent",

        //Box
        instanceBoxEvent: "instanceBoxEvent",
    }


};

export default settingBasic;


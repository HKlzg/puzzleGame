import settingBasic from "../../Setting/settingBasic";

const achieveTyps = settingBasic.setting.achievements;

class achievement { //每个成就的详细信息
    type: number;
    name: string;
    desc: string;
    isGet: boolean;
    count: number;
    needNum: number;
    otherInfo: any;
    constructor({ type, name,desc, isGet, count, needNum, otherInfo }) {
        this.type = type;
        this.name = name;
        this.desc = desc;
        this.isGet = isGet;
        this.count = count;
        this.needNum = needNum;
        this.otherInfo = otherInfo;
    }
    
}

class levelAchievements {//每关的 成就信息
    lv: number;
    achievements: achievement[]; //当前关卡的所有成就信息

    constructor(lv, achievements) {
        this.lv = lv;
        this.achievements = achievements;
    }
}

//成就系统 仅仅用于存储记录 无需绑定节点
export default class AchievementControllor {
    public itemKey = settingBasic.setting.storageKey.achievement;
    //所有的成就
    public achieveRecords: levelAchievements[] = [new levelAchievements(0, [])];

    //单例 唯一的对象
    private static achieveManager = new AchievementControllor();

    private achieveTipNode: cc.Node = null; //UIcamera下的显示节点
    private achieveNode: cc.Node = null; //book里面的 成就页面节点


    constructor() {

        // cc.sys.localStorage.removeItem(this.itemKey) //清除所有成就记录 test
        //先根据成就设定 初始化
        for (let lv = 1; lv <= 5; lv++) {
            let achieves: [achievement] = settingBasic.setting.achievementsInit["lv" + lv];
            let record = new levelAchievements(lv, achieves);
            this.achieveRecords.push(record);
        }

        //从本地加载记录 保存到achieveRecords 对象中; key- achievementRecords
        let records = cc.sys.localStorage.getItem(this.itemKey);
        if (records) {
            this.achieveRecords = JSON.parse(records);
        }
        // console.log("===加载成就 achieveRecords : " + JSON.stringify(this.achieveRecords))
    }
    //初始化值
    public setAchieveTipNode(achieveTipNode) {
        this.achieveTipNode = achieveTipNode;
    }
    public setAchieveNode(achieveNode) {
        this.achieveNode = achieveNode;
    }


    //清除指定关卡记录
    public clearRecord(lv?: number) {
        if (lv > 0) { //初始化一关
            this.achieveRecords[lv] = settingBasic.setting.achievementsInit["lv" + lv];
        } else {    //初始化所有
            for (let index = 1; index <= 5; index++) {
                let achieves: [achievement] = settingBasic.setting.achievementsInit["lv" + lv];
                let record = new levelAchievements(lv, achieves);
                this.achieveRecords.push(record);
            }
        }
    }
    /**
     * 增加成就的记录 +1
     * @param lv 关卡 和 对应achieveRecords下标对应 从1 开始
     * @param type 成就类型
     */
    public addRecord(lv: number, type: number) {
        let lvAchievements = this.achieveRecords[lv].achievements;
        for (let index = 0; index < lvAchievements.length; index++) {
            let achieve = lvAchievements[index]
            if (achieve.type == type && !achieve.isGet) {
                //累计次数达到指定次数之后 获得成就
                achieve.count++;
                console.log("=====[" + achieve.name + "]成就点+1" + "  当前点数:" + achieve.count)
                if (achieve.count >= achieve.needNum) {
                    achieve.isGet = true;
                    console.log("====获得成就: " + achieve.name)
                    //刷新成就页面
                    this.achieveNode.getComponent("achieveMarkControllor").refrush();
                    //UI提示
                    this.achieveTipNode.getComponent("achievementTipControllor").showAchievement(achieve.name);

                    this.saveToLocalStorage();
                    return;
                }
            }
        }


    }
    //返回单一的实例
    public static getAchieveManager() {
        return AchievementControllor.achieveManager ? AchievementControllor.achieveManager : new AchievementControllor();
    }
    //记录到本地存储
    saveToLocalStorage() {
        cc.sys.localStorage.setItem(this.itemKey, JSON.stringify(this.achieveRecords))
    }

    //获取所有成就记录
    public getAllAchievements(): levelAchievements[] {
        return this.achieveRecords;
    }

}

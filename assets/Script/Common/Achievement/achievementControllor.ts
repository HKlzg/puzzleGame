import settingBasic from "../../Setting/settingBasic";

const achieveTyps = settingBasic.setting.achievements;

class achievement { //每个成就的详细信息
    type: number;
    name: string;
    isGet: boolean;
    count: number;
    needNum: number;
    otherInfo: any;
    constructor({ type, name, isGet, count, needNum, otherInfo }) {
        this.type = type;
        this.name = name;
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

//成就系统
export default class AchievementControllor {
    public itemKey = "achievementRecords";
    //所有的成就
    public achieveRecords: levelAchievements[] = [new levelAchievements(0, [])];
    //已经获得了的成就
    public getAchievements: levelAchievements[] = [new levelAchievements(0, [])];
    //单例 唯一的对象
    public static achieveManager = new AchievementControllor();

    constructor() {
        // cc.sys.localStorage.removeItem(this.itemKey) //清除所有记录
        //从本地加载记录 保存到achieveRecords 对象中; key- achievementRecords
        let records = cc.sys.localStorage.getItem(this.itemKey);
        if (records) {
            this.achieveRecords = JSON.parse(records);
            //将获得的成就记录到getAchievements中
            this.achieveRecords.forEach(e => {
                e.achievements.forEach(ach => {
                    if (ach.isGet) {
                        this.getAchievements.push(new levelAchievements(e.lv, []));
                        this.getAchievements[e.lv].achievements.push(ach);
                    }
                })
            });

        } else {
            //没有找到记录 则初始化一次
            for (let lv = 1; lv <= 5; lv++) {
                let achieves: [achievement] = settingBasic.setting.achievementsInit["lv" + lv];
                let record = new levelAchievements(lv, achieves);
                this.achieveRecords.push(record);
            }
        }
        // console.log("=====achieveRecords=" + JSON.stringify(this.achieveRecords))
        // console.log("=====getAchievements=" + JSON.stringify(this.getAchievements))
    }
    //由viewcontrl 的update 调用来更新
    public toUpdate(info: {}, lv: number) {
    }

    //清除记录
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
    //增加成就的记录 
    public addRecord(lv: number, type: number, addNum: number) {
        let lvAchievements = this.achieveRecords[lv].achievements;
        for (let index = 0; index < lvAchievements.length; index++) {
            let achieve = lvAchievements[index]
            if (achieve.type == type && !achieve.isGet) {
                //累计次数达到指定次数之后 获得成就
                if (addNum + achieve.count >= achieve.needNum) {
                    achieve.isGet = true;
                    // console.log("====获得成就: " + achieve.name)
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
}

import settingBasic from "../../Setting/settingBasic";
import CanvasControllor from "../../Common/CanvasControllor";

const achieveTyps = settingBasic.setting.achievements;

class achievement { //每个成就的详细信息
    type: number;
    name: string;
    desc: string;
    isGet: boolean;
    count: number;
    needNum: number;
    constructor({ type, name, desc, isGet, count, needNum }) {
        this.type = type;
        this.name = name;
        this.desc = desc;
        this.isGet = isGet;
        this.count = count;
        this.needNum = needNum;
    }
}

//成就系统 仅仅用于其他地方调用 新增成就
export default class AchievementControllor {
    //当前已达成的所有成就记录
    public achieveRecords: achievement[] = [];
    //单例 唯一的对象
    private static achieveManager = new AchievementControllor();

    private canvasCtrl: CanvasControllor = null;
    private newAchieve: achievement[] = [];

    constructor() {
        //先根据成就设定 初始化
        settingBasic.setting.achievementsInit.forEach(e => {
            this.achieveRecords.push(e);
        })

    }

    /**
     * 增加成就的记录 +1
     * @param type 成就类型
     */
    public addRecord(type: number) {
        //在当前已达成的成就中查找
        let currAchievements = this.achieveRecords;

        for (let index = 0; index < currAchievements.length; index++) {
            let achieve = currAchievements[index]
            if (achieve.type == type && !achieve.isGet) {
                //累计次数达到指定次数之后 获得成就
                achieve.count++;
                console.log("=====[" + achieve.name + "]成就点+1" + "  当前点数:" + achieve.count)
                if (achieve.count >= achieve.needNum) {
                    achieve.isGet = true;
                    console.log("====获得成就: " + achieve.name);
                }
                this.newAchieve.push(achieve);
                return;
            }
        }
        //在所有成就中查找
        let allAchievements = settingBasic.setting.achievementsInit;

        for (let index = 0; index < allAchievements.length; index++) {
            let achieve = allAchievements[index]
            if (achieve.type == type && !achieve.isGet) {
                achieve.count++;
                console.log("=====[" + achieve.name + "]成就点+1" + "  当前点数:" + achieve.count)
                if (achieve.count >= achieve.needNum) {
                    achieve.isGet = true;
                    console.log("====获得成就: " + achieve.name)
                }
                this.newAchieve.push(achieve);
                this.achieveRecords.push(allAchievements[index]);
                break;
            }
        }
    }
    //新成就
    public getNewAchieve(): achievement[] {
        return this.newAchieve;
    }

    public clearNewAchieveTip() {
        this.newAchieve = [];
    }

    //返回单一的实例
    public static getAchieveManager() {
        return AchievementControllor.achieveManager ? AchievementControllor.achieveManager : new AchievementControllor();
    }

    //当前已达成的所有成就记录
    public setAllAchievements(achi: achievement[]) {
        this.achieveRecords = achi;
    }

}

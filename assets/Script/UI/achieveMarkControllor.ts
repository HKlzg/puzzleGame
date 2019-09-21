
import AchievementControllor from "../Common/Achievement/achievementControllor";
import settingBasic from "../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

class achievement { //每个成就的详细信息
    type: number;
    name: string;
    desc: string;
    isGet: boolean;
    count: number;
    needNum: number;
    otherInfo: any;
    constructor({ type, name, desc, isGet, count, needNum, otherInfo }) {
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
/**
 * 成就 书签. 只控制成就是否显示
 */
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    achievePerfab: cc.Prefab = null;
    @property(cc.Node)
    content: cc.Node = null;

    //所有成就类型
    achieveTypes = settingBasic.setting.achievements;

    allAchievements: achievement[] = [];//存储所有成就

    achieveManager = AchievementControllor.getAchieveManager();
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.achieveManager.setAchieveNode(this);

    }
    start() {
        this.refrush();

    }

    //从成就系统获取新的信息
    public refrush() {
        //读取所有成就信息
        let newList: levelAchievements[] = this.achieveManager.getAllAchievements();
        //不同点
        let differeList: achievement[] = [];
        //对比成就节点  
        newList.forEach(achieveList => {
            if (achieveList.lv > 0) {
                achieveList.achievements.forEach(achieve => {
                    if (achieve.isGet) { //成就已获得
                        //和当前记录allAchievements对比
                        if (this.allAchievements.length > 0) {
                            let has = false;
                            for (let index = 0; index < this.allAchievements.length; index++) {
                                if (this.allAchievements[index].type == achieve.type) {
                                    has = true;
                                    break;
                                }
                            }
                            if (!has) {
                                this.allAchievements.push(achieve);
                                differeList.push(achieve);
                            }
                        } else {
                            this.allAchievements.push(achieve);
                            differeList.push(achieve);
                        }
                    }
                })
            }
        });
        this.addAchievement(differeList);

    }

    //新增成就节点
    public addAchievement(newAchiList: achievement[]) {
        newAchiList.forEach(achieve => {
            let newAchieve = cc.instantiate(this.achievePerfab);
            newAchieve.active = true;
            try {
                newAchieve.getChildByName("name").getComponent(cc.Label).string = achieve.name;
                newAchieve.getChildByName("desc").getComponent(cc.Label).string = achieve.desc;
                newAchieve.parent = this.content;
            } catch (error) {
                console.log(" ===新增成就点错误:" + error);
            }
        })
    }
    // update (dt) {}


}

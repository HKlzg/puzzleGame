
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
    constructor({ type, name, desc, isGet, count, needNum }) {
        this.type = type;
        this.name = name;
        this.desc = desc;
        this.isGet = isGet;
        this.count = count;
        this.needNum = needNum;
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
    itemKey = settingBasic.setting.storageKey.achievement;
    canvasCtrl: any = null;
    onLoad() {
        this.canvasCtrl = cc.find("Canvas").getComponent("CanvasControllor")
    }
    start() {
    }
    update(dt) {

    }
    //从成就系统获取新的信息
    public refrush(achieves) {
        //不同点
        let differeList: achievement[] = [];
        //对比成就节点  
        achieves.forEach((achieve) => {
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
         this.addAchievement(differeList);
        this.saveToLocalStorage();
        //清除
        this.achieveManager.clearNewAchieveTip();
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

    //显示所有成就点
    public showAll() {
        let allAchieve = this.canvasCtrl.getGameRecords().achievements;
        this.refrush(allAchieve)
    }

    //记录到本地存储
    saveToLocalStorage() {
        this.canvasCtrl.saveRecords(this.itemKey, this.allAchievements);
    }
}

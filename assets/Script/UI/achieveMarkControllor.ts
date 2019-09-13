
import AchievementControllor from "../Common/Achievement/achievementControllor";
import settingBasic from "../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
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
/**
 * 成就 书签. 只控制成就是否显示
 */
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    preBt: cc.Node = null;
    @property(cc.Node)
    nextBt: cc.Node = null;

    //所有成就类型
    achieveTypes = settingBasic.setting.achievements;

    currPage: number = 0;
    pageNodeList: cc.Node[] = []; //页 元素从0开始 对应页数

    allAchieveNodeList: cc.Node[] = [];//存储所有成就的节点
    allAchieveMentList: levelAchievements[] = []; //所有成就记录(包含达成/未达成))
    achieveManager = AchievementControllor.getAchieveManager();
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.achieveManager.setAchieveNode(this);
        //将page节点存入this.pageNodeList
        this.node.children.forEach(e => {
            e.name.substr(0, 4) == "page" ? this.pageNodeList.push(e) : null;
        })
        //获取所有成就节点
        this.pageNodeList.forEach(page => {
            page.children.forEach(node => {
                let nodeCtrl = node.getComponent("achieveLogoControllor");
                if (nodeCtrl) {
                    this.allAchieveNodeList.push(node);
                    node.active = false;
                }
            })
        })

    }
    start() {
        this.refrush();
        //翻页
        this.changePage(this.currPage)
    }

    public refrush() {
        //读取所有成就信息
        this.allAchieveMentList = this.achieveManager.getAllAchievements();
        //根据记录显示成就节点
        this.allAchieveMentList.forEach(achieveList => {
            if (achieveList.lv > 0) {
                achieveList.achievements.forEach(achieve => {
                    if (achieve.isGet) {
                        this.showAchievement(achieve.type)
                    }
                })
            }
        })

    }

    //显示成就节点
    public showAchievement(type: number) {
        this.allAchieveNodeList.forEach(node => {
            let ctrl = node.getComponent("achieveLogoControllor");
            if (ctrl && type == ctrl.getLogo()) {
                node.active = true;
            }
        })
    }
    // update (dt) {}

    //上一页
    prePage() {
        this.currPage--;
        this.currPage = this.currPage > 0 ? this.currPage : 0;
        this.changePage(this.currPage);
    }
    //下一页
    nextPage() {
        this.currPage++;
        this.currPage = this.currPage < this.pageNodeList.length - 1 ? this.currPage : this.pageNodeList.length - 1;
        this.changePage(this.currPage);
    }

    //翻页
    changePage(pageIndex: number) {
        for (let index = 0; index < this.pageNodeList.length; index++) {
            this.pageNodeList[index].active = pageIndex == index;
            this.preBt.active = pageIndex != 0;
            this.nextBt.active = pageIndex != this.pageNodeList.length - 1;
        }
    }

}

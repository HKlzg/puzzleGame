import settingBasic from "../Setting/settingBasic";
import { gameRecordClass } from "./BasicClass/recordClass";
import AchievementControllor from "../Common/Achievement/achievementControllor";

const { ccclass, property } = cc._decorator;

//用于初始化 参数
@ccclass
export default class CanvasControllor extends cc.Component {

    @property(cc.Node)
    UIcamera: cc.Node = null;
    @property(cc.Node)
    UIMask: cc.Node = null;
    @property(cc.Node)
    backMask: cc.Node = null;

    scenePerfabList: cc.Prefab[] = [];
    //存储的key
    recorderKey = settingBasic.setting.storageKey.game;
    sceneList: cc.Node[] = [];
    // LIFE-CYCLE CALLBACKS:
    gameRecord: gameRecordClass = null;
    onLoad() {
        // this.clearRecord();//test
        this.loadRecords();

        this.UIcamera.active = false;
        this.UIMask.active = false;
        //加载perfab资源
        let self = this;
        cc.loader.loadResDir('Perfabs', cc.Prefab, function (err, perfabList) {
            if (err) {
                console.log("加载perfab 失败:" + JSON.stringify(err));
            }

            for (let i = 0; i < perfabList.length; i++) {
                let nameIndex: string = perfabList[i].name.substr(5, 1);
                let index = Number(nameIndex);
                self.scenePerfabList[index] = perfabList[i];
                console.log("===加载====:" + perfabList[i].name);
            }

            self.scenePerfabList.forEach(e => {
                let scene = cc.instantiate(e);
                scene.active = false;
                self.node.addChild(scene);
                self.sceneList.push(scene);
            })
            settingBasic.game.currScene = self.sceneList[0].name;
            self.UIcamera.active = true;
            self.UIMask.active = true;
        });

    }

    start() {

    }

    getSceneList(): cc.Node[] {
        return this.sceneList;
    }
    //重新加载当前场景
    getSceneByCurrLv(callBack: Function) {
        let index = settingBasic.game.currLevel - 1;
        let currSceneName = settingBasic.game.currScene;
        let self = this;
        let siblingIndex = this.sceneList[index].getSiblingIndex();
        cc.loader.loadResDir('Perfabs', cc.Prefab, function (err, perfabList) {
            if (err) {
                console.log("加载perfab 失败:" + JSON.stringify(err));
            }
            for (let i = 0; i < perfabList.length; i++) {
                if (perfabList[i].name == currSceneName) {
                    let scene = cc.instantiate(perfabList[i]);
                    scene.active = false;
                    self.node.removeChild(self.sceneList[index])
                    self.node.addChild(scene);
                    scene.setSiblingIndex(siblingIndex);
                    self.sceneList[index] = scene;
                    callBack(scene);
                    break;
                }
            }

        });

    }

    //切换下一个场景 -过场黑幕动画
    loadNextScene() {
        let cursen = this.sceneList[settingBasic.game.currLevel - 1];
        this.backMask.active = true;
        cursen.getChildByName("Background").getComponent("backgroundControllor").closeAllEvents(1, () => {
            cc.tween(this.backMask).then(cc.fadeIn(2)).call(() => {
                let nextsen = this.sceneList[settingBasic.game.currLevel];
                if (cursen)
                    cursen.active = false;
                if (nextsen) {
                    nextsen.active = true;
                    nextsen.getChildByName("Background").getComponent("backgroundControllor").closeAllEvents(1, null, 0, "IN");
                }
            }).then(cc.fadeOut(2)).call(() => {
            }).start();
        }, 0, "OUT");
    }
    //切换上一个场景 -过场黑幕动画
    loadLastScene() {
        this.backMask.active = true;
        let cursen = this.sceneList[settingBasic.game.currLevel - 1];
        cursen.getChildByName("Background").getComponent("backgroundControllor").closeAllEvents(-1, () => {

            cc.tween(this.backMask).then(cc.fadeIn(2)).call(() => {
                let lastsen = this.sceneList[settingBasic.game.currLevel - 2];
                if (cursen)
                    cursen.active = false;
                if (lastsen) {
                    lastsen.active = true;
                    lastsen.getChildByName("Background").getComponent("backgroundControllor").closeAllEvents(-1, null, 0, "OUT");
                }
            }).then(cc.fadeOut(2)).call(() => {
            }).start();
        }, 0, "IN");
    }

    //加载记录
    loadRecords() {
        let rec = cc.sys.localStorage.getItem(this.recorderKey);
        if (rec) {
            let record: gameRecordClass = JSON.parse(rec);
            if (record) {
                // console.log("================record=="+JSON.stringify(record)+"  "+record.playerName)
                this.gameRecord = record;
                //设置成就记录
                AchievementControllor.getAchieveManager().setAllAchievements(this.gameRecord.achievements);

            } else {
                this.gameRecord = new gameRecordClass();
            }
        } else {
            this.gameRecord = new gameRecordClass();
        }
    }

    public saveRecords(key, val) {
        let keys = settingBasic.setting.storageKey;
        switch (key) {
            case keys.game:
                this.gameRecord = val;
                break;
            case keys.achievement:
                this.gameRecord.achievements = val;
                break;
            case keys.item:
                this.gameRecord.items = val;
                break;
            default:
                break;
        }
        // console.log("================save=="+JSON.stringify(this.gameRecord))
        cc.sys.localStorage.setItem(this.recorderKey, JSON.stringify(this.gameRecord));

    }

    public getGameRecords(): gameRecordClass {
        return this.gameRecord;
    }

    public clearRecord(){
        cc.sys.localStorage.removeItem(this.recorderKey)
    }

    onDestroy() {
        this.saveRecords(this.recorderKey, this.gameRecord);
    }
}

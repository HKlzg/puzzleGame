import settingBasic from "../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

//用于初始化 参数
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    UIcamera: cc.Node = null;
    @property(cc.Node)
    UIMask: cc.Node = null;
    @property(cc.Node)
    backMask: cc.Node = null;

    scenePerfabList: cc.Prefab[] = [];

    sceneList: cc.Node[] = [];
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
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

}

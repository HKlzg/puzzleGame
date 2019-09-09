import settingBasic from "../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

//用于初始化 参数
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    UIcamera: cc.Node = null;
    @property(cc.Node)
    UIMask: cc.Node = null;

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

    // update (dt) {}

    getSceneList(): cc.Node[] {
        return this.sceneList;
    }

    compare(a, b): number {
        return a - b;
    }

}


const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    txtLabel: cc.Label = null;

    loadLevel: number = 0
    onload() {
    }
    start() {
        settingBasic.fun.setScene("loading", cc.director.getScene());

        this.loadLevel = settingBasic.game.currLevel;
        this.txtLabel.string = this.loadLevel >= 0 ? "第" + this.loadLevel + "关" : "恭喜通关";
    }

    update(dt) {
        this.loading();
    }
    loading() {
        if (this.progressBar.progress < 1) {
            this.progressBar.progress += 0.02
        } else {
            //找不到对应的场景时 切换到主页面
            // cc.director.loadScene(this.loadLevel < 0 ? "homePage" : "level_" + this.loadLevel)
            let sceneName = this.loadLevel < 0 ? "homePage" : "level_" + this.loadLevel;
            cc.director.loadScene(sceneName);
             
        }
    }
}

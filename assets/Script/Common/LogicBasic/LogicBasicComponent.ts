import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
const gameStateType = settingBasic.setting.stateType;

/**
 * 用于 需要统一暂停控制的 节点继承 .UI 节点不能继承此 抽象类
 */
@ccclass
export abstract class LogicBasicComponent extends cc.Component {
    isPause: boolean = false;
    isInit: boolean = false;
    onLoad() { }
    start() { }

    //初始化参数 防止被子类重写
    init() {

    }

    update(dt) {
        if (!this.isInit) {
            this.isInit = true;
            this.init()
        }

        let state = settingBasic.game.State;

        switch (state) {
            case gameStateType.START:
                this.startGame();
                break;
            case gameStateType.PAUSE:
                if (!this.isPause) {
                    this.pauseGame();
                }
                break;
            case gameStateType.RESUME:
                if (this.isPause) {
                    this.resumeGame();
                }
                break;
            default:
                break;
        }

        if (this.isPause) return;

        this.logicUpdate(dt);
    }

    /**
     * 替代component 中的update，用于游戏逻辑控制
     */
    abstract logicUpdate(dt);

    private startGame() {
        // this.isPause = false;
    }
    private pauseGame() {
        //暂停游戏  停用update 逻辑 
        this.isPause = true;
    }
    private resumeGame() {
        this.isPause = false;

    }

}



import settingBasic from "../../Setting/settingBasic";
const { ccclass, property } = cc._decorator;
const gameStateType = settingBasic.setting.stateType;

class recordsType {

}

/**
 * 用于 需要统一暂停控制的 节点继承 .UI 节点不能继承此 抽象类
 */
@ccclass
export abstract class LogicBasicComponent extends cc.Component {
    isPause: boolean = false;
    isInit: boolean = false;
    /**
     * 需要暂停Action的节点数组
     */
    actionNodeList: cc.Node[] = [];
    rigidBody: cc.RigidBody = null;
    phyBody: any = null;

    //当前记录的node 信息
    nodeRecords: recordsType = null;

    onLoad() { }
    start() { }

    //初始化参数 防止被子类重写
    init() {

        this.rigidBody = this.node.getComponent(cc.RigidBody);
        if (this.rigidBody) {
            this.phyBody = this.node.getComponent(cc.PhysicsBoxCollider);
            if (!this.phyBody) {
                this.phyBody = this.node.getComponent(cc.PhysicsCircleCollider);
                if (!this.phyBody) {
                    this.phyBody = this.node.getComponent(cc.PhysicsPolygonCollider);
                }
            }
        }

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
     * 将需要暂停action 的节点添加到 此数组中
     * @param nodeList 
     */
    addActionNodeList(nodeList: cc.Node | cc.Node[]) {
        if (nodeList) {
            if (nodeList instanceof cc.Node) {
                this.actionNodeList.push(nodeList)
            } else {
                this.actionNodeList = nodeList;
            }
        }
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

        this.actionNodeList.forEach(node => {
            node.pauseAllActions();
        })
        this.node.stopAllActions();

    }
    private resumeGame() {
        this.isPause = false;

        this.actionNodeList.forEach(node => {
            node.resumeAllActions();
        });
        this.node.resumeAllActions();
    }

    //记录节点信息
    recordNodeMsg(){
        
    }
    //读取信息
    readNodeMsg(){

    }

}



import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
const gameStateType = settingBasic.setting.stateType;

const colliderTypes = cc.Enum({
    none: 0,
    box: 1,
    circle: 2,
    polygon: 3,
})

class nodeRecord {
    groupIndex: number;
    // localPos: cc.Vec2;
    active: number; //0-false/1-true
    width: number;
    height: number;
    scale: number;
    scaleX: number;
    scaleY: number;
    angle: number;
    opacity: number;
    anchorX: number;
    anchorY: number;
    worldPos: cc.Vec2;
}
class rigidBodyRecord {
    enabled: number;//0-false/1-true
    allowSpeep: number;//0-false/1-true;
    gravityScale: number;
    linearVelocity: cc.Vec2;
    angularVelocity: number;
    linearDamping: number;
    angularDapming: number;
    fixedRotation: number;
    awake: number;
    active: number;
}
class phyColliderRecord {
    colliderType: number;
    density: number;
    sensor: number;
    friction: number;
    restitution: number; //弹性
    enabled: number;
    offset: cc.Vec2;
    size: cc.Size;   //box/polygon 才有
    radius: number;//circle才有
}
class colliderRecord {
    colliderType: number;
    enabled: number;//0-false/1-true
    offset: cc.Vec2;
    size: cc.Size;   //box/polygon 才有
    radius: number;//circle才有
}


class recordType {
    node: nodeRecord;
    rigidBody: rigidBodyRecord;
    phyColliderBody: phyColliderRecord;
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
    colliderBody: any = null; //碰撞组件
    phyColliderBody: any = null;//物理碰撞组件
    colliderType: number = 0; //碰撞组件类型
    phyColliderType: number = 0; //物理碰撞组件类型

    //当前记录的node 信息
    nodeRecords: recordType = null;
    //设定制定分组 才能存储
    groupIndexList: Array<number> = [0, 3, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 19, 23, 24, 25];

    onLoad() { }
    start() { }

    //初始化参数 防止被子类重写
    init() {
        settingBasic.game.isClearCurrRecord ? this.removeNodeRecord() : null;

        this.rigidBody = this.node.getComponent(cc.RigidBody);
        if (this.rigidBody) {
            this.phyColliderBody = this.node.getComponent(cc.PhysicsBoxCollider);
            this.phyColliderType = colliderTypes.box;
            if (!this.phyColliderBody) {
                this.phyColliderBody = this.node.getComponent(cc.PhysicsCircleCollider);
                this.phyColliderType = colliderTypes.circle;
                if (!this.phyColliderBody) {
                    this.phyColliderBody = this.node.getComponent(cc.PhysicsPolygonCollider);
                    this.phyColliderType = colliderTypes.polygon;
                    if (!this.phyColliderBody) {
                        this.phyColliderType = colliderTypes.none;
                    }
                }
            }
        }
        if (this.rigidBody) {
            this.colliderBody = this.node.getComponent(cc.BoxCollider);
            this.colliderType = colliderTypes.box;
            if (!this.colliderBody) {
                this.colliderBody = this.node.getComponent(cc.CircleCollider);
                this.colliderType = colliderTypes.circle;
                if (!this.colliderBody) {
                    this.colliderBody = this.node.getComponent(cc.PolygonCollider);
                    this.colliderType = colliderTypes.polygon;
                    if (!this.colliderType) {
                        this.colliderType = colliderTypes.none;
                    }
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
        
        //记录节点信息
        // this.recordNodeRecord();
    }
    private resumeGame() {
        this.isPause = false;

        this.actionNodeList.forEach(node => {
            node.resumeAllActions();
        });
        this.node.resumeAllActions();

        //加载Record
        // this.loadNodeRecord();
    }

    removeNodeRecord() {
        let key = this.node.uuid + settingBasic.game.currLevel;
        cc.sys.localStorage.removeItem(key);
        settingBasic.game.isClearCurrRecord = false;
        console.log("==removeNodeRecord==")
    }


    //加载信息 还原
    
    //设置下次重新 载入时 清除record
    setClearRecord() {
        settingBasic.game.isClearCurrRecord = true;
    }
    //根据分组来判断是否能此节点序列化
    isCanRecord(groupIndex: number): boolean {
        for (let index = 0; index < this.groupIndexList.length; index++) {
            if (groupIndex == this.groupIndexList[index]) {
                return true;
            }
        }
        return false;
    }

}



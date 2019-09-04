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

    //记录节点信息
    recordNodeRecord() {
        if (!this.isCanRecord(this.node.groupIndex)) return

        let record: recordType = new recordType();
        let node: nodeRecord = new nodeRecord();
        let rigidBody: rigidBodyRecord = new rigidBodyRecord();
        let phyColliderBody: phyColliderRecord = new phyColliderRecord();
        let colliderBody: colliderRecord = new colliderRecord();
        //------记录信息
        //Node
        node.angle = this.node.angle;
        node.active = this.node.active ? 1 : 0;
        node.anchorX = this.node.anchorX;
        node.anchorY = this.node.anchorY;
        node.groupIndex = this.node.groupIndex;
        node.width = this.node.width;
        node.height = this.node.height;
        node.opacity = this.node.opacity;
        node.worldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        node.scale = this.node.scale;
        node.scaleX = this.node.scaleX;
        node.scaleY = this.node.scaleY;
        //RigidBody
        if (this.rigidBody) {
            rigidBody.active = this.rigidBody.active ? 1 : 0;
            rigidBody.allowSpeep = this.rigidBody.allowSleep ? 1 : 0;
            rigidBody.angularDapming = this.rigidBody.angularDamping;
            rigidBody.angularVelocity = this.rigidBody.angularVelocity;
            rigidBody.awake = this.rigidBody.awake ? 1 : 0;
            rigidBody.enabled = this.rigidBody.enabled ? 1 : 0;
            rigidBody.fixedRotation = this.rigidBody.fixedRotation ? 1 : 0;
            rigidBody.gravityScale = this.rigidBody.gravityScale;
            rigidBody.linearDamping = this.rigidBody.linearDamping;
            rigidBody.linearVelocity = this.rigidBody.linearVelocity;
        }
        //phycisCollider
        if (this.phyColliderBody) {
            phyColliderBody.enabled = this.phyColliderBody.enabled ? 1 : 0;
            phyColliderBody.density = this.phyColliderBody.density;
            phyColliderBody.friction = this.phyColliderBody.friction;
            phyColliderBody.restitution = this.phyColliderBody.restitution;
            phyColliderBody.sensor = this.phyColliderBody.sensor ? 1 : 0;
            phyColliderBody.offset = this.phyColliderBody.offset;
            if (this.phyColliderType == colliderTypes.circle) {
                phyColliderBody.radius = this.phyColliderBody.radius;
            } else {
                phyColliderBody.size = this.phyColliderBody.size;
            }
        }
        //colliderBody
        if (this.colliderBody) {
            colliderBody.enabled = this.colliderBody.enabled ? 1 : 0;
            colliderBody.offset = this.colliderBody.offset;
            if (this.colliderType == colliderTypes.circle) {
                colliderBody.radius = this.colliderBody.radius;
            } else {
                colliderBody.size = this.colliderBody.size;
            }
        }
        record.node = node;
        record.rigidBody = rigidBody;
        record.phyColliderBody = phyColliderBody;
        let key = this.node.uuid + settingBasic.game.currLevel;
        cc.sys.localStorage.setItem(key, JSON.stringify(record));
    }
    removeNodeRecord() {
        let key = this.node.uuid + settingBasic.game.currLevel;
        cc.sys.localStorage.removeItem(key);
        settingBasic.game.isClearCurrRecord = false;
        console.log("==removeNodeRecord==")
    }


    //加载信息 还原
    loadNodeRecord() {
        if (!this.isCanRecord(this.node.groupIndex)) return

        // console.log(this.node.name + "==-------------2-------loadNodeRecord----------------------=== ")
        let key = this.node.uuid + settingBasic.game.currLevel;
        let recordJson = cc.sys.localStorage.getItem(key);

        if (recordJson) {
            // console.log(this.node.name + " ==:=== " + recordJson);
            let record: recordType = JSON.parse(recordJson);
            if (record) {
                let node: nodeRecord = record.node;
                let rigidBody: rigidBodyRecord = record.rigidBody;
                let phyColliderBody: phyColliderRecord = record.phyColliderBody
                let colliderBody: colliderRecord = record.phyColliderBody;
                //设定信息
                if (node) {
                    this.node.angle = node.angle;
                    this.node.active = node.active == 1;
                    this.node.anchorX = node.anchorX;
                    this.node.anchorY = node.anchorY;
                    this.node.groupIndex = node.groupIndex;
                    this.node.width = node.width;
                    this.node.height = node.height;
                    this.node.position = this.node.parent.convertToNodeSpaceAR(cc.v2(node.worldPos.x, node.worldPos.y));
                    this.node.opacity = node.opacity;
                    this.node.scale = node.scale;
                    this.node.scaleX = node.scaleX;
                    this.node.scaleY = node.scaleY;
                }
                //rigidBody
                if (this.rigidBody && rigidBody) {
                    this.rigidBody.active = rigidBody.active == 1;
                    this.rigidBody.allowSleep = rigidBody.allowSpeep == 1;
                    this.rigidBody.angularDamping = rigidBody.angularDapming;
                    this.rigidBody.angularVelocity = rigidBody.angularVelocity;
                    this.rigidBody.awake = rigidBody.awake == 1;
                    // this.rigidBody.enabled = rigidBody.enabled == 1;
                    rigidBody.enabled == 1 ? this.node.active = true : this.rigidBody.enabled = false;
                    this.rigidBody.fixedRotation = rigidBody.fixedRotation == 1;
                    this.rigidBody.gravityScale = rigidBody.gravityScale;
                    this.rigidBody.linearDamping = rigidBody.linearDamping;
                    this.rigidBody.linearVelocity = rigidBody.linearVelocity;

                    //phycisCollider
                    if (this.phyColliderBody && phyColliderBody) {
                        this.phyColliderBody.enabled = phyColliderBody.enabled == 1;
                        this.phyColliderBody.density = phyColliderBody.density;
                        this.phyColliderBody.friction = phyColliderBody.friction;
                        this.phyColliderBody.restitution = phyColliderBody.restitution;
                        this.phyColliderBody.sensor = phyColliderBody.sensor == 1;
                        phyColliderBody.offset ? this.phyColliderBody.offset = cc.v2(phyColliderBody.offset.x, phyColliderBody.offset.y) : null;

                        if (this.phyColliderType == colliderTypes.circle) {
                            this.phyColliderBody.radius = phyColliderBody.radius;
                        } else {
                            phyColliderBody.size ? this.phyColliderBody.size = cc.size(phyColliderBody.size.width, phyColliderBody.size.height) : null;
                        }
                    }

                    //colliderBody
                    if (this.colliderBody && colliderBody) {
                        this.colliderBody.enabled = colliderBody.enabled == 1;
                        colliderBody.offset ? this.colliderBody.offset = cc.v2(colliderBody.offset.x, colliderBody.offset.y) : null;

                        if (this.colliderType == colliderTypes.circle) {
                            this.colliderBody.radius = colliderBody.radius;
                        } else {
                            colliderBody.size ? this.colliderBody.size = cc.size(colliderBody.size.width, colliderBody.size.height) : null;
                        }
                    }

                }

                if (this.phyColliderBody) {
                    this.phyColliderBody.apply();
                }
            }

        }
    }
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



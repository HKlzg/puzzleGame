import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;
class childType {
    node: cc.Node;
    initVec: cc.Vec2;
    angle: number;
    constructor(node: cc.Node, v: cc.Vec2, ang: number) {
        this.node = node;
        this.initVec = v;
        this.angle = ang;
    };
}

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    cameraNode: cc.Node = null;
    @property(cc.Integer)
    speed: number = 0; //默认值
    @property(cc.Node) //需要跟随的子节点 
    followNodeList: cc.Node[] = [];

    preCameraPos: cc.Vec2 = null;

    //包含rigidBody 的子节点
    phyChildrens: Array<childType> = [];
    prePos: cc.Vec2 = null;
    preAngle: number = 0;

    onLoad() { }

    start() {
        if (!this.cameraNode) this.cameraNode = cc.find("Canvas/Camera");

        this.preCameraPos = this.cameraNode.position;

        //---------
        this.addPhyChildrens(this.followNodeList);
        this.prePos = this.node.position;
        this.preAngle = this.node.angle;

    }
    logicUpdate(dt) {
        let currCamerPos = this.cameraNode.position;
        // if (this.node.groupIndex == 2) { console.log("=1==box==logicUpdate=") }

        if (!this.preCameraPos.fuzzyEquals(currCamerPos, 1)) {

            if (this.preCameraPos.x < currCamerPos.x) {
                //camera向右 前景向左
                let pos = this.node.position;
                this.node.runAction(cc.moveTo(dt, cc.v2(pos.x - this.speed, pos.y)))
            }
            if (this.preCameraPos.x > currCamerPos.x) {
                //camera向左
                let pos = this.node.position;
                this.node.runAction(cc.moveTo(dt, cc.v2(pos.x + this.speed, pos.y)))
            }
            this.preCameraPos = this.cameraNode.position;
        }

        this.updateChildrenBody();
    }
    //设置跟随对象
    public setMoveSpeed(speed: number) {
        this.speed = speed;
    }
    //返回 此物体的移动速度
    public getMoveSpeed(): number {
        return this.speed;
    }


    //-------------- 同步 子节点位置 ----------s------
    //添加含有rigidBody 的子节点 
    addPhyChildrens(nodeList: cc.Node[]) {
        if (!nodeList) return;
        nodeList.forEach((node) => {
            if (node.getComponent(cc.RigidBody)) {
                this.phyChildrens.push(new childType(node, node.position, node.angle));

            }
        });
    }
    //同步更新子节点的位置
    updateChildrenBody() {
        if (this.prePos.equals(this.node.position) && this.preAngle == this.node.angle) return

        this.phyChildrens.forEach((e) => {
            e.node.angle = 0;
            e.node.position = e.initVec;
            e.node.angle = e.angle;
        })
    }
    //-------------- 同步 子节点位置 ----------e------
}


import toolsBasics from "../../Tools/toolsBasics";
const { ccclass, property } = cc._decorator;

@ccclass
export default class CreatRopes extends cc.Component {
    @property({ type: cc.Node, displayName: "绳子节点数组" })
    nodeList: Array<cc.Node> = [];

    @property({ type: cc.Prefab, displayName: "绳子预制体" })
    ropePerfabs: cc.Prefab = null;

    @property({ type: cc.Boolean, displayName: "是否连接节点" })
    isConnect: boolean;

    @property({ type: cc.Float, displayName: "绳子重力" })
    ropeGravity: number = 1;

    @property({ type: cc.Node, displayName: "绳子父节点" })
    ropeConnect: cc.Node = null;

    @property({ type: cc.String, displayName: "绳子名称" })
    ropeName: string;

    @property({ type: cc.Integer, displayName: "绳子分组序号" })
    groupIndex: number = 1;

    onLoad() {
        this.isConnect = true;
        this.ropeName = "";
        let ropeNode = toolsBasics.creatRope(this.ropePerfabs, this.ropeGravity, this.nodeList, this.isConnect, this.ropeName,this.groupIndex);

        this.ropeConnect.addChild(ropeNode);

    }
    start() {

    }
}

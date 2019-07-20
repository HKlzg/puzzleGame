
import toolsBasics from "../../Tools/toolsBasics";
const { ccclass, property } = cc._decorator;

@ccclass
export default class CreatRopes extends cc.Component {
    @property({ type: cc.Node, displayName: "节点数组" })
    nodeList: Array<cc.Node> = [];

    @property({ type: cc.Prefab, displayName: "预制体" })
    ropePerfabs: cc.Prefab = null;

    @property({ type: cc.Boolean, displayName: "是否连接节点" })
    isConnect: boolean;

    @property({ type: cc.Float, displayName: "重力" })
    ropeGravity: number = 1;

    @property({ type: cc.Node, displayName: "父节点" })
    ropeConnect: cc.Node = null;

    @property({ type: cc.String, displayName: "名称" })
    ropeName: string;

    @property({ type: cc.Integer, displayName: "分组序号" })
    groupIndex: number = 7;

    onLoad() {
        this.isConnect = true;
        this.ropeName = "";
        let ropeNode = toolsBasics.createCable(this.ropePerfabs, this.ropeGravity, this.nodeList, this.isConnect, this.ropeName, this.groupIndex);

        this.ropeConnect.addChild(ropeNode);

    }
    start() {

    }
}


const { ccclass, property } = cc._decorator;
import tools from "../../Tools/toolsBasics";

@ccclass
export default class NewClass extends cc.Component {
    @property({ type: cc.Prefab, displayName: "绳子预制体" })
    ropePerfab: cc.Prefab = null;

    @property({ type: cc.Float, displayName: "绳子重力" })
    ropeGravity: number = 1;

    @property({ type: cc.Float, displayName: "阶梯间隔高度" })
    stepHeight: number = 50;

    @property({ type: cc.Node, displayName: "左固定点" })
    leftNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "右固定点" })
    rightNode: cc.Node = null;

    @property({ type: cc.Prefab, displayName: "阶梯预制体" })
    stickPerfab: cc.Prefab = null;

    @property({ type: cc.Integer, displayName: "阶梯个数" })
    stickNum = 1;

    stepWidth = 50;

    ropeLeftList: Array<cc.Node> = [];

    ropeRightList: Array<cc.Node> = [];

    onLoad() {
        this.stepWidth = Math.abs(this.rightNode.x - this.leftNode.x);
 

        this.createRopes();
    }

    start() {

    }

    //生成两条绳子
    /**
     *  //leftRope: 必须包含 用DistinctJoint,RevoluteJoint
        //stick :必须包含 用 RevoluteJoint
        //rightRope :必须包含 用 RevoluteJoint

        //连接方式:left: 用DistinctJoint 连接 stick ,stick用 RevoluteJoint连接 right
     */
    createRopes() {
        let ropeLeft: cc.Node = null;
        let ropeRight: cc.Node = null;

 
        for (let n = 1; n <= this.stickNum; n++) {
            ropeLeft = cc.instantiate(this.leftNode);
            ropeRight = cc.instantiate(this.rightNode);
            
 

            if (n % 2 == 0) {//偶数
                ropeLeft.setPosition(0, -this.stepHeight);
                ropeRight.setPosition(0, -this.stepHeight);
            } else { //奇数
                ropeLeft.setPosition(0, 0);
                ropeRight.setPosition(0, 0);
            }
            if (n == 1) {
                ropeLeft.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static
                ropeRight.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static
            } else {

                ropeLeft.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
                ropeRight.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
            }
            ropeLeft.addComponent(cc.DistanceJoint);

            this.leftNode.addChild(ropeLeft)
            this.rightNode.addChild(ropeRight)
            this.ropeLeftList.push(ropeLeft)
            this.ropeRightList.push(ropeRight)
        }
        console.log("============ropeLeftList=="+this.ropeLeftList.length)
        // this.node.addChild(tools.creatRope(this.ropePerfab, this.ropeGravity, this.ropeLeftList, true, "ropeLadderL"))
        // this.node.addChild(tools.creatRope(this.ropePerfab, this.ropeGravity, this.ropeRightList, true, "ropeLadderR"))

        this.createRopeLadder(this.ropeLeftList, this.ropeRightList, this.stickPerfab, this.stepWidth);
    }

    createRopeLadder(ropeLeftList: Array<cc.Node>, ropeRightList: Array<cc.Node>, stickPerfab, stepWidth) {

        // let stick = null;
        // let stickJoint: cc.RevoluteJoint = null;
        // for (let i = 0; i < ropeRightList.length; i++) {
        //     stick = cc.instantiate(stickPerfab);
        //     stick.active = true;
            
        //     ropeLeftList[i].getComponent(cc.DistanceJoint).connectedBody = stick.getComponent(cc.RigidBody);
        //     stickJoint = stick.getComponent(cc.RevoluteJoint)
        //     stickJoint.connectedBody = ropeRightList[i].getComponent(cc.RigidBody)
        //     stickJoint.anchor.x = stepWidth;
        //     ropeLeftList[i].addChild(stick);

        // }

       


    }



    update (dt) {

    }
}

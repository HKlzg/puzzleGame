// import toolsBasics from "../../Tools/toolsBasics";
import settingBasic from "../../Setting/settingBasic";
const { ccclass, property } = cc._decorator;

@ccclass
export default class River extends cc.Component {
    @property(cc.Node)
    brotherNode: cc.Node = null;
    @property(cc.Node)
    VillagerNode: cc.Node = null;

    CanvasNode: cc.Node = null;
    isRescued: boolean = false;
    bootVel: number = -3;
    bootAcc: number = 0; //加速度

    leftMaxPos: number = -300;
    rightMaxPos: number = 300;
    vLeft: number = -3;
    vRight: number = 2;
    onLoad() {
        this.CanvasNode = cc.find("Canvas")
    }

    update(dt) {
        if (!this.isRescued) {
            //船 来回移动
            //向右
            if (this.node.x >= (this.leftMaxPos + this.vLeft) && this.node.x <= this.leftMaxPos) { //左侧的转向区间
                this.brotherNode.scaleX = 1;
                if (this.node.x <= 0) {
                    this.bootAcc = 0.1; //加速
                } else {
                    this.bootAcc = -0.1;
                }
                this.bootVel = this.vRight;
                this.bootVel += this.bootAcc;
                this.bootVel = this.bootVel <= 0 ? 0 : this.bootVel;
            }
            //向左
            if (this.node.x >= this.rightMaxPos && this.node.x <= this.rightMaxPos + this.vRight) { //右侧的转向区间
                this.brotherNode.scaleX = -1;
                if (this.node.x >= 0) {
                    this.bootAcc = 0.1;
                } else {
                    this.bootAcc = -0.1;
                }
                this.bootVel = this.vLeft;
                this.bootVel += this.bootAcc;
                this.bootVel = this.bootVel >= 0 ? 0 : this.bootVel;
            }
            this.node.runAction(cc.moveTo(0.2, cc.v2(this.node.x + this.bootVel, this.node.y)))


        } else {
            //获救之后
            if (this.node.x >= 400) {
                this.CanvasNode.emit(settingBasic.gameEvent.gameStateEvent, settingBasic.setting.stateType.NEXT)
                this.isRescued = false;
            } else {
                // this.node.runAction(cc.moveTo(3, cc.v2(this.node.x + 50, this.node.y)))
            }
        }

    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (!this.isRescued && otherCollider.node.groupIndex == 6) { //6-PERSON
            this.isRescued = true;
            this.VillagerNode.parent = this.node
            this.VillagerNode.scale = 0.5;
            let index = this.brotherNode.getSiblingIndex();
            this.VillagerNode.setSiblingIndex(index + 1);
            this.VillagerNode.x = this.VillagerNode.getContentSize().width * this.VillagerNode.scale / 2
            this.VillagerNode.y = this.VillagerNode.getContentSize().height * this.VillagerNode.scale / 2;
        }

    }


}
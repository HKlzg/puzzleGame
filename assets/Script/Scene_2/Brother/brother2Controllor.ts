import { BrotherBasic } from "../../Common/Brother/brotherBasic"

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends BrotherBasic {

    start() {
    }
    toUpdate() { };

    //重写
    rayCheck() {
        //已经有推的物体 则不进行检测
        if (this.pushObject) return;

        let pos1 = this.node.convertToWorldSpace(cc.Vec2.ZERO)
        pos1 = cc.v2(pos1.x, pos1.y - 40);
        let pos2 = cc.v2(pos1.x + this.rayWidth, pos1.y);
        let pos3 = cc.v2(pos1.x - this.rayWidth, pos1.y);
        let results = null;

        if (this.node.scaleX > 0) {
            //向右检测
            results = cc.director.getPhysicsManager().rayCast(pos1, pos2, cc.RayCastType.Any);
        } else {
            //向左检测
            results = cc.director.getPhysicsManager().rayCast(pos1, pos3, cc.RayCastType.Any);
        }
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            let collider = result.collider;

            if (!collider.node) return;

            if (collider.node.name == "stone") {
                this.isReadyClimbBox = true;
                this.pushObject = collider.node;
            }
            if (collider.node.groupIndex == 2 && !this.isPlaying && this.pushObject != collider.node) { //箱子
                this.pushObject = collider.node;
                this.order.action = this.actionType.ClimbBox;
                this.order.direction = this.node.scaleX > 0 ? this.actionDirection.Right : this.actionDirection.Left;
                this.brotherAction(this.order);
                console.log("==================ClimbBox=================")
            }

            //只对第一个结果检测
            return;
        }

    }
}

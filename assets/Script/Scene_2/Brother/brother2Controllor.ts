import { BrotherBasic } from "../../Common/Brother/brotherBasic"

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends BrotherBasic {

    start() {
    }
    toUpdate() { };

    //重写
    rayCheck() {

        let pos1 = this.node.convertToWorldSpace(cc.Vec2.ZERO)
        pos1 = cc.v2(pos1.x, pos1.y - 40);
        let pos2 = cc.v2(pos1.x + this.rayWidth, pos1.y);
        let pos3 = cc.v2(pos1.x - this.rayWidth, pos1.y);
        let results = null;

        if (this.node.scaleX > 0) {
            results = cc.director.getPhysicsManager().rayCast(pos1, pos2, cc.RayCastType.Any);
            for (let i = 0; i < results.length; i++) {
                let result = results[i];
                let collider = result.collider;
                if (collider.node.name == "stone") {
                    this.isReadyClimbBox = true;
                    this.pushObject ? null : this.pushObject = collider.node;
                }
                if(collider.node.groupIndex == 2){ //箱子
                    this.pushObject ? null : this.pushObject = collider.node;
                    this.order.action = this.actionType.ClimbBox;
                    this.order.direction = this.actionDirection.Right;
                    this.brotherAction(this.order);
                }

            }
        } else {
            results = cc.director.getPhysicsManager().rayCast(pos1, pos3, cc.RayCastType.Any);
            for (let i = 0; i < results.length; i++) {
                let result = results[i];
                let collider = result.collider;
                if (collider.node.name == "stone") {
                    this.isReadyClimbBox = true;
                    this.pushObject ? null : this.pushObject = collider.node;
                }
                if(collider.node.groupIndex == 2){ //箱子
                    this.pushObject ? null : this.pushObject = collider.node;
                    this.order.action = this.actionType.ClimbBox;
                    this.order.direction = this.actionDirection.Left;
                    this.brotherAction(this.order);
                }
            }
        }

    }
}

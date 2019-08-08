
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    cameraNode: cc.Node = null;

    preCameraPos: cc.Vec2 = null;
    @property(cc.Integer)
    speed: number = 4;
    onLoad() { }

    start() {
        this.preCameraPos = this.cameraNode.position;
     }
    update(dt) {
        let currCamerPos = this.cameraNode.position;

        if (!this.preCameraPos.equals(currCamerPos)) {
            
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
        } else {
           
        }

    }

}


const { ccclass, property } = cc._decorator;
import toolsBasics from "../../Tools/toolsBasics";
import settingBasic from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    brotherNode: cc.Node = null;
    camera: cc.Camera = null;
    maskNode: cc.Node = null;
    canvas: cc.Node = null;
    circular: cc.Node = null;
    grap: cc.Graphics = null;
    start() {
        this.maskNode = this.node.parent;
        this.canvas = this.maskNode.parent;
        this.camera = this.canvas.getChildByName("Camera").getComponent(cc.Camera);
        this.brotherNode = this.maskNode.getChildByName("Brother");
        this.circular = this.canvas.getChildByName("Circular"),
            this.grap = this.circular.getChildByName("DrawLine").getComponent(cc.Graphics)

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    update(dt) {
        if (this.node.y < -1500) {
            this.node.removeFromParent()
        }
    }
    setBoxPos(touchPos) {
        let centerPos = this.brotherNode.convertToWorldSpace(cc.Vec2.ZERO);
        let rDis = this.circular.width / 2;
        let vec: cc.Vec2 = cc.Vec2.ZERO;
        vec = toolsBasics.calcBoxPosFromCircle(centerPos, touchPos, rDis, this.grap, this.maskNode);

        // this.circular.setPosition(this.circular.parent.convertToNodeSpaceAR((this.brotherNode.convertToWorldSpace(cc.v2(0, 0)))));
        // this.circular.active = true;
        this.node.setPosition(vec);

        let dire = touchPos.x >= centerPos.x ? "R" : "L";
        let order: { direction: string, action: string } = { direction: dire, action: "MAGIC" }
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
    }

    //-----------------------event----------------
    touchStart(event) {
        let touchPos = event.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(touchPos))
        this.setBoxPos(touchPos)
    }
    touchMove(event) {
        let touchPos = event.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(touchPos))
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.Vec2.ZERO
        this.setBoxPos(touchPos)
    }
    touchEnd(event) {
        this.circular.active = false;
    }

}

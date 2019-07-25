
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    camera: cc.Camera = null;

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);

        this.camera = cc.find("Canvas/MainCamera").getComponent(cc.Camera)
    }

    update(dt) {
        if (this.node.y < -1500) {
            this.node.removeFromParent()
        }
    }
    
    touchStart(event) {
        let touchPos = event.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(touchPos))
        event.stopPropagation()
    }
    touchMove(event) {
        let touchPos = event.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(touchPos))
        event.stopPropagation()
    }
    touchEnd(event) { }

}

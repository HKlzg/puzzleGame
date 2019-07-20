import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    canvasNode: cc.Node = null;
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartCallback, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveCallback, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchStopCallback, this);
        this.canvasNode = this.node.parent;
    }

    start() {

    }

    onTouchStartCallback(event) {
        let touchLoc = event.touch.getLocation();
        let loclPos = this.canvasNode.convertToNodeSpaceAR(touchLoc);
        this.node.x = loclPos.x;

        if (this.node.x > cc.winSize.width / 2) {
            this.node.x = cc.winSize.width / 2;
        }
        if (this.node.x < -cc.winSize.width / 2) {
            this.node.x = -cc.winSize.width / 2;
        }

        //阻止事件冒泡
        event.stopPropagation();
    }
    onTouchMoveCallback(event) {
        let touchLoc = event.touch.getLocation();
        let loclPos = this.canvasNode.convertToNodeSpaceAR(touchLoc);
        this.node.x = loclPos.x;

        if (this.node.x > cc.winSize.width / 2) {
            this.node.x = cc.winSize.width / 2;
        }
        if (this.node.x < -cc.winSize.width / 2) {
            this.node.x = -cc.winSize.width / 2;
        }


        event.stopPropagation();
    }
    onTouchStopCallback(event) {
        event.stopPropagation();
    }

    update() {

        if (settingBasic.game.State == settingBasic.setting.stateType.OVER) {
            this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStartCallback, this);
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveCallback, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchStopCallback, this);
        }

    }
}

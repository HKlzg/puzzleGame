
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    cameraTip: cc.Node = null;

    @property(cc.Node)
    item: cc.Node = null;


    // onLoad () {}
    grap: cc.Graphics = null; //test
    start() {
        this.item.on(cc.Node.EventType.TOUCH_START, this.moveItem, this)
        this.item.on(cc.Node.EventType.TOUCH_MOVE, this.moveItem, this)
        this.grap = this.node.getComponent(cc.Graphics)
    }

    update(dt) {

        this.checkItemPos();
    }

    checkItemPos() {
        let itemPos = this.item.convertToWorldSpace(cc.Vec2.ZERO);
        itemPos.y = itemPos.y + this.item.height * this.item.scaleY;
        let bagPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);
        bagPos.y = bagPos.y + this.node.height * this.node.scaleY;

        if (itemPos.y >= bagPos.y) {
            //移出边界

        }

    }

    moveItem(e) {
        let touchPosLocal = this.item.parent.convertToNodeSpaceAR(e.getLocation())
        this.item.position = touchPosLocal;
    }
}

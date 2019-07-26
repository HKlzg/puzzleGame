const { ccclass, property } = cc._decorator;
import toolsBasics from "../../Tools/toolsBasics";
import settingBasic from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    boxShadowPerfab: cc.Prefab = null;

    brotherNode: cc.Node = null;
    camera: cc.Camera = null;
    maskNode: cc.Node = null;
    canvas: cc.Node = null;
    circular: cc.Node = null;
    grap: cc.Graphics = null;
    body: cc.RigidBody = null;
    boxCollider: cc.BoxCollider = null;
    phyBoxCollider: cc.PhysicsBoxCollider = null;
    boxShadow: cc.Node = null;

    gravityScale: number = 0;
    spriteFrame: cc.SpriteFrame = null;
    start() {

        this.canvas = cc.find("Canvas");
        this.maskNode = this.canvas.getChildByName("Mask");
        this.camera = this.canvas.getChildByName("Camera").getComponent(cc.Camera);
        this.brotherNode = this.maskNode.getChildByName("Brother");
        this.circular = this.canvas.getChildByName("Circular");
        this.grap = this.circular.getChildByName("DrawLine").getComponent(cc.Graphics)
        this.body = this.node.getComponent(cc.RigidBody)
        this.gravityScale = this.body.gravityScale;
        this.spriteFrame = this.node.getComponent(cc.Sprite).spriteFrame;
        this.boxCollider = this.node.getComponent(cc.BoxCollider);
        this.phyBoxCollider = this.node.getComponent(cc.PhysicsBoxCollider);

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
        vec = toolsBasics.calcBoxPosFromCircle(centerPos, touchPos, rDis, this.grap, this.node.parent);

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

        this.body.gravityScale = 0;
        this.body.type = cc.RigidBodyType.Static;
        this.phyBoxCollider.sensor = true;
        this.boxCollider.enabled = false;
        this.phyBoxCollider.apply();

        //还原为shadow显示
        this.boxShadow = cc.instantiate(this.boxShadowPerfab);
        this.node.parent.addChild(this.boxShadow);
        this.boxShadow.setPosition(this.node.position);
        this.boxShadow.active = true;
        this.node.getComponent(cc.Sprite).spriteFrame = null;
    }
    touchMove(event) {
        let touchPos = event.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(touchPos))
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.Vec2.ZERO
        this.setBoxPos(touchPos)

        this.boxShadow.setPosition(this.node.position);
    }
    touchEnd(event) {
        this.circular.active = false;

        this.body.gravityScale = this.gravityScale;
        this.body.type = cc.RigidBodyType.Dynamic;
        //还原为BoxInstante显示
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrame
        this.phyBoxCollider.sensor = false;
        this.boxCollider.enabled = true;
        this.phyBoxCollider.apply();

        this.boxShadow.removeFromParent();

    }

}

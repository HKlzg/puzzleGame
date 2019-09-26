import toolsBasics from "../../Tools/toolsBasics";
import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";
import audioSetting from "../Audio/audioSetting";
const { ccclass, property } = cc._decorator;
const actionType = settingBasic.setting.actionType;
const actionDirection = settingBasic.setting.actionDirection;

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Prefab)
    boxShadowPerfab: cc.Prefab = null;

    brotherNode: cc.Node = null;
    camera: cc.Camera = null;
    cameraNode: cc.Node = null;
    maskNode: cc.Node = null;
    canvas: cc.Node = null;
    currScene: cc.Node = null;
    circular: cc.Node = null;
    grap: cc.Graphics = null;
    body: cc.RigidBody = null;
    boxCollider: cc.BoxCollider = null;
    phyBoxCollider: cc.PhysicsBoxCollider = null;
    boxShadow: cc.Node = null;

    gravityScale: number = 0;
    spriteFrame: cc.SpriteFrame = null;
    preBoxPos: cc.Vec2 = null;
    isDeath: boolean = false;
    isInstance: boolean = true;//是否是实体

    preTouchId: number = 0;
    followObject: cc.Node = null;//跟随的物体

    isforegContrl: any = null; //脚本对象
    background: cc.Node = null;
    backgroundRange = { maxX: 0, maxY: 0, minX: 0, minY: 0 };

    audioSource: any = null;

    isPlayAudio = false;
    start() {

        this.canvas = cc.find("Canvas");
        this.currScene = this.canvas.getChildByName(settingBasic.game.currScene);
        this.background = this.currScene.getChildByName("Background");
        this.maskNode = this.currScene.getChildByName("Mask");
        this.cameraNode = this.currScene.getChildByName("Camera")
        this.circular = this.currScene.getChildByName("Circular");
        this.camera = this.cameraNode.getComponent(cc.Camera);
        this.brotherNode = this.maskNode.getChildByName("Brother");
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

        //
        this.isforegContrl = this.node.addComponent("foregroundControllor");
        this.isforegContrl.setMoveSpeed(0);

        this.audioSource = cc.find("UICamera/audio").getComponent("audioControllor");
    }

    logicUpdate(dt) {

        this.isDeath = settingBasic.game.State == settingBasic.setting.stateType.REBORN;
    }

    onDestroy() {
    }

    setBoxPos(touchPos) {
        let centerPos = this.brotherNode.convertToWorldSpace(cc.Vec2.ZERO);
        let rDis = this.circular.width / 2;
        let vec: cc.Vec2 = cc.Vec2.ZERO;
        vec = toolsBasics.calcBoxPosFromCircle(centerPos, touchPos, rDis, this.grap, this.node.parent);

        this.node.setPosition(vec);

        let dire = touchPos.x >= centerPos.x ? actionDirection.Right : actionDirection.Left;
        this.brotherNode.scaleX = touchPos.x >= centerPos.x ? 1 : -1;
        let order: { direction: number, action: number } = { direction: dire, action: actionType.MAGIC }
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
    }

    //-----------------------event----------------
    touchStart(event) {

        if (this.preTouchId && event.getID() != this.preTouchId) return
        this.preTouchId = event.getID();
        //是否死亡
        this.preBoxPos = this.node.position;

        if (this.isDeath) return;

        this.isPlayAudio = false;
        this.isInstance = false;
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
        this.boxShadow.angle = this.node.angle;
        this.node.getComponent(cc.Sprite).enabled = false;

    }
    touchMove(event) {
        this.isInstance = false;
        if (this.preTouchId && event.getID() != this.preTouchId) return
        if (this.isDeath || !this.boxShadow) return;

        let touchPos = event.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(touchPos))
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.Vec2.ZERO
        this.setBoxPos(touchPos)

        this.boxShadow.setPosition(this.node.position);
    }
    touchEnd(event) {
        if (this.preTouchId && event.getID() != this.preTouchId) return
        this.preTouchId = null;
        if (!this.boxShadow) return;

        this.circular.active = false;

        this.body.gravityScale = this.gravityScale;
        this.body.type = cc.RigidBodyType.Dynamic;
        //还原为BoxInstante显示
        this.rigidBody.enabledContactListener = true;
        this.node.getComponent(cc.Sprite).enabled = true;
        this.node.angle = this.boxShadow.angle;
        this.phyBoxCollider.sensor = false;
        this.boxCollider.enabled = true;
        this.phyBoxCollider.apply();

        if (this.isDeath) { //人物死亡 箱子还原
            this.node.setPosition(this.preBoxPos);

            this.boxShadow.destroy();
        } else {

            let shadowPic = this.boxShadow.getComponent(cc.Sprite).spriteFrame;
            if (shadowPic.name == "box_red") {
                this.node.setPosition(this.preBoxPos);
            }
            this.boxShadow.destroy();
        }

        //人物动作
        let touchPos = event.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos);
        let centerPos = this.brotherNode.convertToWorldSpace(cc.Vec2.ZERO);

        let dire = touchPos.x >= centerPos.x ? actionDirection.Right : actionDirection.Left;
        let order: { direction: number, action: number } = { direction: dire, action: actionType.Wait }
        this.brotherNode.emit(settingBasic.gameEvent.brotherPlayState, false) //取消人物isPlaying 状态
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)

        this.isInstance = true;

    }

    //找到挂载 前景脚本的 父节点
    getForgoundParent(node: cc.Node, callBackfun: Function): cc.Node {
        if (!node) return null;
        if (node && node instanceof cc.Scene) return null;

        if (node instanceof cc.Node) {
            let ctrl = node.getComponent("foregroundControllor");
            if (ctrl) {
                // console.log("=1=follow==name=" + node.name)
                callBackfun(node);
                return node;
            } else {
                if (node.parent) {
                    this.getForgoundParent(node.parent, callBackfun);
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    }

    //--------------------------碰撞---Event---------------------
    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.isInstance) {

            // ----------音效---------
            if (!this.isPlayAudio) {
                let vy1 = otherCollider.node.getComponent(cc.RigidBody).linearVelocity.y;
                let vy2 = selfCollider.node.getComponent(cc.RigidBody).linearVelocity.y;
                if (Math.abs(vy1 - vy2) > 50) {
                    if (otherCollider.node.groupIndex == 2 || otherCollider.node.groupIndex == 25) { //箱子、木桩
                        this.audioSource.playAudio(audioSetting.box.crash.onWood, false, 0.2, 0.2);
                    }
                    if (otherCollider.node.groupIndex == 4) { //地面 /草地
                        if (settingBasic.game.currLevel == 2) {//lv2 ->草地
                            this.audioSource.playAudio(audioSetting.box.crash.onGrass);
                        } else {                               //地面
                            this.audioSource.playAudio(audioSetting.box.crash.onGround, false, 0.2, 0.2);
                        }
                    }
                    if (otherCollider.node.groupIndex == 12 || otherCollider.node.groupIndex == 13) { //石头
                        this.audioSource.playAudio(audioSetting.box.crash.onStone);
                    }
                    this.isPlayAudio = true;
                }

            }
        }


        //-------------跟随--------------
        if (this.followObject && this.followObject == otherCollider.node || otherCollider.node.groupIndex == 6) return;

        if (!this.followObject) {
            this.getForgoundParent(otherCollider.node, (forgNode) => {
                // console.log("=2=follow==forgNode=" + forgNode.name + "  collidor : " + otherCollider.name)
                if (forgNode && forgNode instanceof cc.Node) {
                    let forgCtrl = forgNode.getComponent("foregroundControllor");
                    //若碰撞物有 挂载 前景脚本,则和碰撞体同步
                    if (forgCtrl) {
                        let speed = forgCtrl.getMoveSpeed();
                        this.followObject = otherCollider.node;

                        this.isforegContrl.setMoveSpeed(speed);
                        // this.isforegContrl.enabled = true;
                    }
                }

            });
        }

    }
    onEndContact(contact, selfCollider, otherCollider) {

        if (this.followObject) {
            if (this.followObject == otherCollider.node) {
                this.isforegContrl.setMoveSpeed(0)
                this.followObject = null;
            }
        }

        this.isPlayAudio = false;

    }

    public getIsInstance(): boolean {
        return this.isInstance
    }
}

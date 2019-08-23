import toolsBasics from "../../Tools/toolsBasics";
import settingBasic from "../../Setting/settingBasic";
const { ccclass, property } = cc._decorator;
const actionType = settingBasic.setting.actionType;
const actionDirection = settingBasic.setting.actionDirection;
const itemType = settingBasic.setting.itemType;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    forbiddenNode: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:
    currItemType: number = -1;
    phyCollider: any = null;
    collider: any = null;

    isForbidden: boolean = false;
    cameraNode: cc.Node = null;
    camera: cc.Camera = null;
    canvas: cc.Node = null;
    brotherNode: cc.Node = null;
    maskNode: cc.Node = null;
    circular: cc.Node = null;
    grap: cc.Graphics = null;
    body: cc.RigidBody = null;
    isDeath: boolean = false;
    gravityScale: number = 0;

    preTouchId: number = 0;
    preItemPos: cc.Vec2 = null;
    initSize: cc.Size = null;
    initGroupIndex: number = 0;
    isCorrectPlace: boolean = false; //是否放置OK
    targetNode: cc.Node = null;  //机关节点
    onLoad() {
        this.canvas = cc.find("Canvas");
        this.cameraNode = this.canvas.getChildByName("Camera");
        this.camera = this.cameraNode.getComponent(cc.Camera);
        this.maskNode = this.canvas.getChildByName("Mask");
        this.brotherNode = this.maskNode.getChildByName("Brother");
        this.circular = this.canvas.getChildByName("Circular");
        this.body = this.node.getComponent(cc.RigidBody)
        this.gravityScale = this.body.gravityScale;

        this.grap = this.circular.getChildByName("DrawLine").getComponent(cc.Graphics);

        this.initSize = this.node.getContentSize();
        this.initGroupIndex = this.node.groupIndex;
    }
    start() {

        this.phyCollider = this.node.getComponent(cc.PhysicsCircleCollider);
        if (!this.phyCollider) {
            this.phyCollider = this.node.getComponent(cc.PhysicsBoxCollider);
            if (!this.phyCollider) {
                this.phyCollider = this.node.getComponent(cc.PhysicsPolygonCollider);
            }
        }

        this.collider = this.node.getComponent(cc.CircleCollider);
        if (!this.collider) {
            this.collider = this.node.getComponent(cc.BoxCollider);
            if (!this.collider) {
                this.collider = this.node.getComponent(cc.PolygonCollider);
            }
        }

        this.forbiddenNode.active = false;
    }

    update(dt) {
        if (this.node.y < -1500) {
            this.node.destroy()
        }
        this.isDeath = settingBasic.game.State == settingBasic.setting.stateType.REBORN;

    }
    //设置item类别
    setItemType(type: number) {
        // console.log("===setItemType= " + type)
        this.currItemType = type;
    }

    getItemType() {
        return this.currItemType;
    }
    //设置显示位置
    setItemPos(touchPos) {
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

    onCollisionEnter(other, self) {
        let otherPos: cc.Vec2 = other.node.convertToWorldSpace(cc.Vec2.ZERO)
        let selfPos = self.node.convertToWorldSpace(cc.Vec2.ZERO)
        //当前item 是 齿轮时
        // console.log("====1=====currItemType=" + this.currItemType);
        switch (this.currItemType) {
            case itemType.gear:
                //--碰撞到大齿轮中心
                // console.log("====2===currItemType==gear===");
                if (other.node.groupIndex == 10 && other.node.name == "centerPos" && otherPos.fuzzyEquals(selfPos, 10)) {
                    if (this.isForbidden && this.phyCollider) {
                        this.isForbidden = false;
                        this.forbiddenNode.active = false;
                    }
                    this.isCorrectPlace = true;
                    this.node.groupIndex = 0;
                    this.targetNode = other.node;
                } else {
                    this.targetNode = null;
                    this.node.groupIndex = this.initGroupIndex;
                    this.isCorrectPlace = false;

                    if (this.phyCollider) {
                        if (this.phyCollider.sensor) {
                            this.forbiddenNode.active = true;
                            this.isForbidden = true;
                        }
                    }
                }
                break;

            default:
                if (this.phyCollider) {
                    if (this.phyCollider.sensor) {
                        this.forbiddenNode.active = true;
                        this.isForbidden = true;
                    }
                }
                break;
        }

    }
    onCollisionStay(other, self) {
        let otherPos: cc.Vec2 = other.node.convertToWorldSpace(cc.Vec2.ZERO)
        let selfPos = self.node.convertToWorldSpace(cc.Vec2.ZERO)
        //当前item 是 齿轮时
        switch (this.currItemType) {
            case itemType.gear:
                //--碰撞到大齿轮
                if (other.node.groupIndex == 10 && other.node.name == "centerPos" && otherPos.fuzzyEquals(selfPos, 10)) {
                    if (this.isForbidden && this.phyCollider) {
                        this.isForbidden = false;
                        this.forbiddenNode.active = false;
                    }
                    this.isCorrectPlace = true;
                    this.node.groupIndex = 0;
                    this.targetNode = other.node;
                } else {
                    this.targetNode = null;

                    this.node.groupIndex = this.initGroupIndex;
                    this.isCorrectPlace = false;

                    if (this.phyCollider) {
                        if (this.phyCollider.sensor) {
                            this.forbiddenNode.active = true;
                            this.isForbidden = true;
                        }
                    }
                }
                break;

            default:
                if (this.phyCollider) {
                    if (this.phyCollider.sensor) {
                        this.forbiddenNode.active = true;
                        this.isForbidden = true;
                    }
                }
                break;
        }
    }
    onCollisionExit(other, self) {

        //当前item 是 齿轮时
        switch (this.currItemType) {
            case itemType.gear:


                break;

            default:
                break;
        }
        if (this.phyCollider) {
            this.forbiddenNode.active = false;
            this.isForbidden = false;
        }
        this.targetNode = null;
        this.node.groupIndex = this.initGroupIndex;
        this.isCorrectPlace = false;
    }


    public getIsForbidden(): boolean {
        return this.isForbidden;
    }

    // 注册事件
    public registEvent(isRegist) {
        if (isRegist) {
            this.node.on(cc.Node.EventType.TOUCH_START, this.startMove, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.moveItem, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.stopMove, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.stopMove, this);
        } else {
            this.node.off(cc.Node.EventType.TOUCH_START, this.startMove, this);
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.moveItem, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.stopMove, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.stopMove, this);

        }
    }
    public startMove(event) {
        // console.log("=====item===startMove====")
        if (this.preTouchId && event.getID() != this.preTouchId) return
        this.preTouchId = event.getID();

        this.preItemPos = this.node.position;
        //是否死亡
        if (this.isDeath) return;

        let touchPos = event.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(touchPos))
        this.setItemPos(touchPos)

        //设置rigidBody
        this.body.gravityScale = 0;
        this.body.type = cc.RigidBodyType.Static;
        this.phyCollider.sensor = true;
        this.phyCollider.apply();

        //还原为shadow显示

    }
    public moveItem(event) {

        if (this.preTouchId && event.getID() != this.preTouchId) return
        if (this.isDeath) return;

        let touchPos = event.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(touchPos))
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.Vec2.ZERO
        this.setItemPos(touchPos)

    }

    public stopMove(event) {

        if (this.preTouchId && event.getID() != this.preTouchId) return
        this.preTouchId = null;

        this.circular.active = false;

        this.body.gravityScale = this.gravityScale;
        this.body.type = cc.RigidBodyType.Dynamic;
        this.phyCollider.sensor = false;
        this.phyCollider.apply();

        //--是否放置成功
        if (this.isCorrectPlace) {
            let otherPos: cc.Vec2 = this.targetNode.convertToWorldSpace(cc.Vec2.ZERO)
            otherPos.x += this.targetNode.width / 2;
            otherPos.y += this.targetNode.height / 2;
            this.node.position = this.node.parent.convertToNodeSpaceAR(otherPos);


            switch (this.currItemType) {
                case itemType.gear: //齿轮
                    // console.log("=====item===targetNode===="+this.targetNode.name)
                    if (this.targetNode) {
                        let gearL = this.targetNode.parent;
                        let initScale = this.node.scale;
                        cc.tween(this.node).delay(0.5).to(0.5, { scale: initScale * 0.9 }).delay(0.5).call(() => {
                            gearL.getComponent("bigGearControllor").openMachine();
                        }).to(1.3, { angle: 180 }).delay(0.2).to(0.3, { angle: 270 }).start()

                    }
                    break;

                default:
                    break;
            }

            //设置为静态 不可移动点击
            this.node.groupIndex = 0;
            this.body.type = cc.RigidBodyType.Static;
            this.phyCollider.sensor = true;
            this.phyCollider.apply();
            this.node.removeComponent(cc.PhysicsCircleCollider);
            this.node.removeComponent(cc.CircleCollider);
            this.node.removeComponent(cc.RigidBody);
            this.registEvent(false);

            this.targetNode = null;
        } else {
            this.node.groupIndex = this.initGroupIndex;

            if (this.isDeath || this.isForbidden) { //人物死亡 还原
                this.node.setPosition(this.preItemPos);
                this.isForbidden = false;
                this.forbiddenNode.active = false;
            }
        }

        //人物动作
        let touchPos = event.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos);
        let centerPos = this.brotherNode.convertToWorldSpace(cc.Vec2.ZERO);

        let dire = touchPos.x >= centerPos.x ? actionDirection.Right : actionDirection.Left;
        let order: { direction: number, action: number } = { direction: dire, action: actionType.Wait }
        this.brotherNode.emit(settingBasic.gameEvent.brotherPlayState, false) //取消isPlaying 状态
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
    }
}

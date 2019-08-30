import tools from "../../Tools/toolsBasics";
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
const { ccclass, property } = cc._decorator;
class childType {
    node: cc.Node;
    initVec: cc.Vec2;
    angle: number;
    constructor(node: cc.Node, v: cc.Vec2, ang: number) {
        this.node = node;
        this.initVec = v;
        this.angle = ang;
    };
}
@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    gear: cc.Node = null;

    @property(cc.Node)
    poleH: cc.Node = null;

    @property(cc.Node)
    poleV: cc.Node = null;

    @property(cc.Node)
    target: cc.Node = null;

    //山体移动的距离
    @property({ type: cc.Integer, displayName: "最高升降距离" })
    maxHeight: number = 100;
    @property({ type: cc.Integer, displayName: "最低升降距离" })
    minHeight: number = 0;
    @property({ type: cc.Integer, displayName: "每次升降的距离" })
    step: number = 20;

    tmpHeight: number = 0;
    audioManager = tools.getAudioManager();
    audioTargetId: number;

    //包含rigidBody 的子节点
    phyChildrens: Array<childType> = [];
    prePos: cc.Vec2 = null;
    preAngle: number = 0;
    // onLoad () {}
    //是否处于旋转中
    isRotation: boolean = false;
    // 是否已经开启机关
    isOpen: boolean = false;

    start() {
        this.addPhyChildrens(this.node);
        this.prePos = this.node.position;
        this.preAngle = this.node.angle;
    }
    logicUpdate(dt) {

        this.updateChildrenBody()
    }

    public getIsRotation(): boolean {
        return this.isRotation;
    }
    public rotation(ang: number) {
        if (!this.isRotation) {
            this.isRotation = true;
            cc.tween(this.node).by(1.5, { angle: ang }, { easing: "sineInOut" }).call(() => {

                //升降
                if (ang < 0) { //升
                    if (this.tmpHeight <= this.maxHeight - this.step) {
                        cc.tween(this.target).call(() => {
                            //播放山体音效
                            this.audioTargetId = this.audioManager.playAudio("targetMove", true)
                        }).to(1, { position: cc.v2(this.target.x, this.target.y + this.step) }, { easing: "sineInOut" }).
                            call(() => {
                                //停止播放山体音效
                                this.audioManager.stopAudioById(this.audioTargetId);
                                this.tmpHeight += this.step;
                                this.isRotation = false;
                            }).start();

                    } else {
                        this.isRotation = false;
                    }
                } else {
                    if (this.tmpHeight >= this.minHeight + this.step) {
                        cc.tween(this.target).call(() => {
                            //播放山体音效
                            this.audioTargetId = this.audioManager.playAudio("targetMove", true)
                        }).to(1, { position: cc.v2(this.target.x, this.target.y - this.step) }, { easing: "sineInOut" }).
                            call(() => {
                                //停止播放山体音效
                                this.audioManager.stopAudioById(this.audioTargetId);
                                this.tmpHeight -= this.step;
                                this.isRotation = false;
                            }).start();
                    } else {
                        this.isRotation = false;
                    }
                }
            }).start()

            this.poleH.getComponent("poleControllor").changePoleType();
            this.poleV.getComponent("poleControllor").changePoleType();

        }
    }

    public getIsOpen(): boolean {
        return this.isOpen;
    }
    //开启机关
    public openMachine() {
        if (this.isOpen) return;
        this.isOpen = true;
        cc.tween(this.poleH).to(1, { scaleX: 1.5 }).
            delay(0.5).
            call(() => {
                cc.tween(this.poleH).to(0.2, { scaleX: 2.5 }).
                    call(() => {
                        this.poleH.groupIndex = 5; //只与箱子碰撞
                        this.poleH.getComponent(cc.PhysicsBoxCollider).apply()
                    }).start();
            }).start()

        cc.tween(this.poleV).to(1, { scaleX: 1.5 }).
            delay(0.5).
            call(() => {
                cc.tween(this.poleV).to(0.2, { scaleX: 2.5 }).
                    call(() => {
                        this.poleV.groupIndex = 5; //只与箱子碰撞
                        this.poleV.getComponent(cc.PhysicsBoxCollider).apply()
                    }).start();
            }).start()
    }

    //
    public addPhyChild(child: cc.Node) {
        if (child.getComponent(cc.RigidBody)) {

            this.phyChildrens.push(new childType(child, child.position, child.angle));
        }
    }
    public removeFromPhyChildrens(child: cc.Node) {
        for (let index = 0; index < this.phyChildrens.length; index++) {
            let ele = this.phyChildrens[index];
            if (ele.node == child) {
                this.phyChildrens.splice(index, 1);
                return;
            }
        }
    }
    addPhyChildrens(parent: cc.Node) {
        parent.children.forEach((node) => {
            if (node.childrenCount > 0) {
                this.addPhyChildrens(node);
            }
            if (node.getComponent(cc.RigidBody)) {
                this.phyChildrens.push(new childType(node, node.position, node.angle));

            }
        });
    }
    //同步更新子节点的位置
    updateChildrenBody() {
        if (this.prePos.equals(this.node.position) && this.preAngle == this.node.angle) return

        this.phyChildrens.forEach((e) => {
            e.node.angle = 0;
            e.node.position = e.initVec;
            e.node.angle = e.angle;
        })
    }


}

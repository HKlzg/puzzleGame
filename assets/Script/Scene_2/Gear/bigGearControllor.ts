import tools from "../../Tools/toolsBasics";
import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import audioSetting from "../../Common/Audio/audioSetting";
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
    audioManager: any = null;
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
        this.audioManager = cc.find("UICamera/audio").getComponent("audioControllor");

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
            //齿轮旋转音效
            let gearAudioID = this.audioManager.playAudio(audioSetting.other.lv2.gear);

            cc.tween(this.node).by(1.5, { angle: ang }, { easing: "sineInOut" }).call(() => {
                this.audioManager.stopAudioById(gearAudioID);
                //升降
                if (ang < 0) { //升
                    if (this.tmpHeight <= this.maxHeight - this.step) {
                        cc.tween(this.target).call(() => {
                            //播放山体音效
                            this.audioTargetId = this.audioManager.playAudio(audioSetting.other.lv2.mountainMove)
                        }).to(1, { position: cc.v2(this.target.x, this.target.y + this.step) }, { easing: "sineInOut" }).
                            call(() => {

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
                            this.audioTargetId = this.audioManager.playAudio(audioSetting.other.lv2.mountainMove)
                        }).to(1, { position: cc.v2(this.target.x, this.target.y - this.step) }, { easing: "sineInOut" }).
                            call(() => {

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

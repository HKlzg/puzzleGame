
const { ccclass, property } = cc._decorator;
import tools from "../../Tools/toolsBasics";

/**
 * 控制齿轮机关
 */
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    mountain: cc.Node = null;

    angle: number = 0
    //是否处于旋转中
    isRotate: boolean = false;
    centerPos: cc.Vec2 = null;
    tmpAngle: number = 45;
    initMountPos: cc.Vec2 = null;

    //山体移动的距离
    maxHeight: number = 100;
    minHeight: number = 0;

    tmpHeight: number = 0;
    step: number = 20;

    audioManager = tools.getAudioManager();
    audioMountainId: number;
    start() {
        this.angle = this.node.angle;
        let pos = this.node.convertToWorldSpace(cc.Vec2.ZERO)
        this.centerPos = cc.v2(pos.x + this.node.width / 2, pos.y + this.node.height / 2);

        this.initMountPos = this.mountain.position;
        this.tmpHeight = this.step;
    }

    onBeginContact(contact, self, other) {
        //只和鱼-9 碰撞
        // console.log("========Gear====Contact== "+ other.node.groupIndex)
        if (other.node.groupIndex != 9) return
        if (!this.isRotate) {

            let worldManifold = contact.getWorldManifold();
            let contPos = worldManifold.points[0]; //碰撞位置
            let ang = 0;
            //************** angle > 0 cc.rotateBy 顺时针转 旋转角度变小 山体下降*/
            ang = contPos.x < this.centerPos.x ? -this.tmpAngle : this.tmpAngle;

            if (this.tmpHeight == this.maxHeight) { //最高点                    
                ang = ang > 0 ? ang : 0; // 只能顺时针 向下移动
            }
            if (this.tmpHeight == this.minHeight) {//最底点                    
                ang = ang < 0 ? ang : 0;  //只能逆时针 向上移动
            }

            if (ang != 0) {
                this.isRotate = true;
                this.node.runAction(
                    cc.sequence(
                        cc.rotateBy(0.5, ang),
                        cc.callFunc(() => {

                            //ang < 0  逆时针 向上移动
                            if (ang < 0) {
                                if (this.tmpHeight <= this.maxHeight - this.step) {
                                    this.mountain.runAction(
                                        cc.sequence(
                                            cc.callFunc(() => {
                                                //播放山体音效
                                                this.audioMountainId = this.audioManager.playAudio("mountainMove", true)
                                            }),
                                            cc.moveTo(1, cc.v2(this.mountain.x, this.mountain.y + this.step)),
                                            cc.callFunc(() => {
                                                //停止播放山体音效
                                                this.audioManager.stopAudioById(this.audioMountainId);
                                            })

                                        ));
                                    this.tmpHeight += this.step;
                                }
                            } else {
                                if (this.tmpHeight >= this.step) {
                                    this.mountain.runAction(
                                        cc.sequence(
                                            cc.callFunc(() => {
                                                //播放山体音效
                                                this.audioMountainId = this.audioManager.playAudio("mountainMove", true)
                                            }),
                                            cc.moveTo(1, cc.v2(this.mountain.x, this.mountain.y - this.step)),
                                            cc.callFunc(() => {
                                                //停止播放山体音效
                                                this.audioManager.stopAudioById(this.audioMountainId);
                                            })
                                        ));
                                    this.tmpHeight -= this.step;
                                }
                            }
                            // console.log("===========tmpHeight= " + this.tmpHeight)
                        }),
                        cc.callFunc(() => {
                            this.isRotate = false
                        })
                    ))
            }

        }
    }


    update(dt) { }
}

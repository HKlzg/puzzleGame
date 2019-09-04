import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    eye_left: cc.Node = null;
    @property(cc.Node)
    eye_right: cc.Node = null;

    @property(cc.Node)
    mouth: cc.Node = null;

    @property(cc.Node)
    person: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    bodyWidth: number = 1100;
    isMovingEye_L: boolean = false;
    isMovingEye_R: boolean = false;

    isStartGame: boolean = false;

    grap: cc.Graphics = null;
    camera: cc.Camera = null;
    //相对父节点的位置 眼睛初始位置以及最大位置
    initEye = {
        initPos_L: { L: cc.v2(-118.187, -39.436), M: cc.v2(-91.675, -45.554), R: cc.v2(-64.483, -53.032) },
        initPos_R: { L: cc.v2(77.354, -53.032), M: cc.v2(99.787, -45.554), R: cc.v2(131.058, -39.436) },
        tempPos: { //中间 位置 与两边的相对坐标
            eye_L: {
                m_l: cc.v2(-91.675, -45.554).subSelf(cc.v2(-118.187, -39.436)),
                m_r: cc.v2(-91.675, -45.554).subSelf(cc.v2(-64.483, -53.032))
            },
            eye_R: {
                m_l: cc.v2(99.787, -45.554).subSelf(cc.v2(77.354, -53.032)),
                m_r: cc.v2(99.787, -45.554).subSelf(cc.v2(131.058, -39.436))
            },
        }
    }

    // onLoad () {}
    start() {
        this.grap = this.node.getChildByName("grap").getComponent(cc.Graphics);
        this.camera = cc.find("Canvas/"+settingBasic.game.currScene).getChildByName("Camera").getComponent(cc.Camera);
        this.scheduleOnce(() => {
            this.isStartGame = true;
        }, 2)
    }

    logicUpdate(dt) {
        if (!this.isStartGame) return;

        this.stareAtPerson();
     }

    //盯着人转动眼睛
     stareAtPerson() {
        let personPos = this.person.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let selfPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);

        let distX = personPos.x - selfPos.x
        //人在左边
        if (distX < 0 && distX >= -this.bodyWidth / 2) {

            let rate_L = distX / (-this.bodyWidth / 2);
            rate_L = rate_L >= 1 ? 1 : rate_L
            rate_L = rate_L <= 0 ? 0 : rate_L

            //-----左眼
            let tempVec_L = this.initEye.tempPos.eye_L.m_l; //m-l 的相对距离
            let tempDist_L = tempVec_L.mag();
            let tmpV_L = tempVec_L.normalize().mul(tempDist_L * rate_L)

            let posMid_L = this.initEye.initPos_L.M.clone();
            posMid_L.x -= tmpV_L.x;
            posMid_L.y -= tmpV_L.y;

            if (posMid_L.x > this.initEye.initPos_L.L.x && posMid_L.x < this.initEye.initPos_L.R.x) {
                this.eye_left.position = posMid_L;
            }

            //--------右眼
            let tempVec_R = this.initEye.tempPos.eye_R.m_l; //m-l 的相对距离
            let tempDist_R = tempVec_R.mag();
            let tmpV_R = tempVec_R.normalize().mul(tempDist_R * rate_L)

            let posMid_R = this.initEye.initPos_R.M.clone();
            posMid_R.x -= tmpV_R.x;
            posMid_R.y -= tmpV_R.y;

            if (posMid_R.x > this.initEye.initPos_R.L.x && posMid_R.x < this.initEye.initPos_R.R.x) {
                this.eye_right.position = posMid_R;
            }
        }

        //人在右边
        if (distX > 0 && distX <= this.bodyWidth / 2) {

            let rate_R = distX / (this.bodyWidth / 2);
            rate_R = rate_R >= 1 ? 1 : rate_R
            rate_R = rate_R <= 0 ? 0 : rate_R
            //-----左眼
            let tempVec_L = this.initEye.tempPos.eye_L.m_r; //m-r 的相对距离
            let tempDist_L = tempVec_L.mag();
            let tmpV_L = tempVec_L.normalize().mul(tempDist_L * rate_R)

            let posMid_L = this.initEye.initPos_L.M.clone();
            posMid_L.x -= tmpV_L.x;
            posMid_L.y -= tmpV_L.y;

            if (posMid_L.x > this.initEye.initPos_L.L.x && posMid_L.x < this.initEye.initPos_L.R.x) {
                this.eye_left.position = posMid_L;
            }
            //-----右眼
            let tempVec_R = this.initEye.tempPos.eye_R.m_r; //m-r 的相对距离
            let tempDist_R = tempVec_R.mag();
            let tmpV_R = tempVec_R.normalize().mul(tempDist_R * rate_R)

            let posMid_R = this.initEye.initPos_R.M.clone();
            posMid_R.x -= tmpV_R.x;
            posMid_R.y -= tmpV_R.y;
             
            if (posMid_R.x > this.initEye.initPos_R.L.x && posMid_R.x < this.initEye.initPos_R.R.x) {
                this.eye_right.position = posMid_R;

            }
        }
    }
 
}

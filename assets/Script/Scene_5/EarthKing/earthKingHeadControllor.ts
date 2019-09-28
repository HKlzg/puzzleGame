import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import settingBasic from "../../Setting/settingBasic";
import audioControllor from "../../Common/Audio/audioControllor";
import audioSetting from "../../Common/Audio/audioSetting";

const { ccclass, property } = cc._decorator;
const attackType = cc.Enum({
    attack: 0,
    fullAttack: 1,
})
const state = cc.Enum({
    state1: 0,
    state2: 1,
    state3: 2,
    stop: 3,
})
//动作指令类型
class actionOrder {
    id: number; //一组动作的标志ID
    action: number;
    delay: number; //延迟
    constructor(id: number, action: number, delay?: number) {
        this.id = id;
        this.action = action;
        this.delay = delay ? delay : 0;
    }
}

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.Node)
    earthKingNode: cc.Node = null;
    @property(cc.Node)
    eye_left: cc.Node = null;
    @property(cc.Node)
    eye_right: cc.Node = null;
    @property(cc.Node)
    mouth: cc.Node = null;
    @property(cc.Node)
    person: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    bodyWidth: number = 800; //body 的宽度
    isStartGame: boolean = false; //是否开始执行update
    isWhatching: boolean = false; //是否是注视中
    isInQuiet: boolean = false; //是否是平静中
    isFlashing: boolean = false;//是否正在射线整个action中;
    isRadiation: boolean = false; //是否是发射射线一小段action中
    audioSource: audioControllor = null;

    grap: cc.Graphics = null;
    camera: cc.Camera = null;

    redLight_left: cc.Node = null;
    redLight_right: cc.Node = null;
    //射线最大偏转角度
    redLightAngle = { max: 15, min: -15 };
    redlightSprite = { L: null, R: null }

    isOrdered: boolean = false; //是否已发送指令
    actionID: number = 0; //用于action分组的id
    //相对父节点的位置 眼睛初始位置以及最大位置
    initEye = {
        initPos_L: { L: cc.Vec2.ZERO, M: cc.Vec2.ZERO, R: cc.Vec2.ZERO },
        initPos_R: { L: cc.Vec2.ZERO, M: cc.Vec2.ZERO, R: cc.Vec2.ZERO },
        tempPos: { //中间 位置 与两边的相对坐标
            eye_L: {
                m_l: cc.v2(18.512, -6.118),
                m_r: cc.v2(-22.1919, 6.4779)
            },
            eye_R: {
                m_l: cc.v2(20.433, 6.4779),
                m_r: cc.v2(-26.2709, -6.118)
            },
        },

    }

    onLoad() {
        this.initEye.initPos_L.M = this.eye_left.position;
        this.initEye.initPos_L.L = this.eye_left.position.sub(this.initEye.tempPos.eye_L.m_l);
        this.initEye.initPos_L.R = this.eye_left.position.sub(this.initEye.tempPos.eye_L.m_r);

        this.initEye.initPos_R.M = this.eye_right.position;
        this.initEye.initPos_R.L = this.eye_right.position.sub(this.initEye.tempPos.eye_R.m_l);
        this.initEye.initPos_R.R = this.eye_right.position.sub(this.initEye.tempPos.eye_R.m_r);

        //红色射线
        this.redLight_left = this.eye_left.getChildByName("redLight");
        this.redLight_right = this.eye_right.getChildByName("redLight");
        this.redlightSprite.L = this.redLight_left.getComponent(cc.Sprite);
        this.redlightSprite.R = this.redLight_right.getComponent(cc.Sprite);
        this.redlightSprite.L.enabled = false;
        this.redlightSprite.R.enabled = false;
        this.redLight_left.opacity = 50;//透明度
        this.redLight_right.opacity = 50;//透明度
        this.redLight_left.scaleX = 0.3//宽度
        this.redLight_right.scaleX = 0.3//

        this.audioSource = cc.find("UICamera/audio").getComponent("audioControllor");

    }
    start() {
        this.grap = this.node.getChildByName("grap").getComponent(cc.Graphics);
        this.camera = cc.find("Canvas/" + settingBasic.game.currScene).getChildByName("Camera").getComponent(cc.Camera);

        cc.tween(this.node).delay(2).call(() => {
            this.isStartGame = true;
        }).start();
    }

    logicUpdate(dt) {
        if (!this.isStartGame) return;
        let currState = this.earthKingNode.getComponent("earthKingControllor").getState();

        if (!this.isRadiation) {
            this.stareAtPerson();
        }

        if (currState == state.state2) {
            this.flashingLight();
        } else if (currState == state.state3) {
            this.flashingLight();
            this.doAction();
        }
    }

    //盯着人转动眼睛
    stareAtPerson() {
        let personPos = this.person.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let selfPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);

        let distX = personPos.x - selfPos.x
        //人在左边
        if (distX < 0 && distX >= -this.bodyWidth / 2) {
            this.isWhatching = true;
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
        else if (distX >= 0 && distX <= this.bodyWidth / 2) {
            //人在右边
            this.isWhatching = true;
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

        } else {
            // 从注视范围 出来之后
            if (!this.isInQuiet && this.isWhatching) {
                this.isWhatching = false;
                this.isInQuiet = true;
                let speed = 0.5;
                cc.tween(this.eye_left).to(speed, { position: this.initEye.initPos_L.M }).start()
                cc.tween(this.eye_right).to(speed, { position: this.initEye.initPos_R.M }).start()
                cc.tween(this.redLight_left).to(speed, { angle: 0 }).start()
                cc.tween(this.redLight_right).to(speed, { angle: 0 }).call(() => {
                    this.isInQuiet = false;
                    this.redlightSprite.L.enabled = false;
                    this.redlightSprite.R.enabled = false;
                    this.redLight_left.opacity = 50;//透明度
                    this.redLight_right.opacity = 50;//透明度
                    this.redLight_left.scaleX = 0.5//宽度
                    this.redLight_right.scaleX = 0.5//
                }).start()
            }
        }

    }

    // 闪烁
    flashingLight() {

        //快速闪烁2次 持续显示3s 关闭5秒 再重复
        if (this.isWhatching && !this.isFlashing) {
            this.isFlashing = true;
            this.isRadiation = true;
            let rayAudioID = -1;
            // 眼睛左右转动 扫射
            let angle = Math.random() > 0.5 ? this.redLightAngle.max : this.redLightAngle.min;
            let otherAng = angle > 0 ? this.redLightAngle.min : this.redLightAngle.max;
            //眼球转动位置
            let L_pos = { pos1: cc.Vec2.ZERO, pos2: cc.Vec2.ZERO };
            let R_pos = { pos1: cc.Vec2.ZERO, pos2: cc.Vec2.ZERO };
            L_pos.pos1 = angle > 0 ? this.initEye.initPos_L.R : this.initEye.initPos_L.L;
            L_pos.pos2 = angle > 0 ? this.initEye.initPos_L.L : this.initEye.initPos_L.R;

            R_pos.pos1 = angle > 0 ? this.initEye.initPos_R.R : this.initEye.initPos_R.L;
            R_pos.pos2 = angle > 0 ? this.initEye.initPos_R.L : this.initEye.initPos_R.R;

            //眼球转动角度
            this.eye_left.position = L_pos.pos1;
            this.eye_right.position = R_pos.pos1;
            this.redLight_left.angle = angle;
            this.redLight_right.angle = angle;

            cc.tween(this.eye_left).to(2, { position: L_pos.pos2, }, { easing: "sineInOut" }).start();
            cc.tween(this.eye_right).to(2, { position: R_pos.pos2, }, { easing: "sineInOut" }).start();

            //闪烁
            cc.tween(this.node).delay(3).call(() => {
                this.redlightSprite.L.enabled = true;
                this.redlightSprite.R.enabled = true;
            }).delay(0.1).call(() => {
                this.redlightSprite.L.enabled = false;
                this.redlightSprite.R.enabled = false;
            }).delay(0.1).call(() => {
                this.redlightSprite.L.enabled = true;
                this.redlightSprite.R.enabled = true;
                //音效
                rayAudioID = this.audioSource.playAudio(audioSetting.other.lv5.eye)
                //
                cc.tween(this.redLight_left).to(0.5, { opacity: 200, scaleX: 0.8 })
                    .to(1.5, { angle: otherAng }, { easing: "sineInOut" }).to(0.5, { angle: 0 }).start();
                cc.tween(this.redLight_right).to(0.5, { opacity: 200, scaleX: 0.8 })
                    .to(1.5, { angle: otherAng }, { easing: "sineInOut" }).to(0.5, { angle: 0 }).start();

            }).delay(2.5).call(() => {
                this.audioSource.stopAudioById(rayAudioID);
                cc.tween(this.redLight_left).to(0.2, { opacity: 50, scaleX: 0.3 }).start();
                cc.tween(this.redLight_right).to(0.2, { opacity: 50, scaleX: 0.3 }).call(() => {
                    this.redlightSprite.L.enabled = false;
                    this.redlightSprite.R.enabled = false;
                    this.isRadiation = false;
                }).start();
            }).delay(4).call(() => {
                this.isFlashing = false;
            }).start()

        }
    }

    //发送动作指令
    doAction() {
        //进入攻击范围
        if (this.isWhatching) {

            let ctrl = this.earthKingNode.getComponent("earthKingControllor");
            //随机生成一组动作
            let orderNum = Math.random() > 0.5 ? 2 : 4;
            for (let index = 0; index < orderNum; index++) {
                let action = Math.random() >= 0.8 ? attackType.attack : attackType.fullAttack;
                let delay = Math.random() >= 0.5 ? 2 : 3;
                //若添加指令失败 直接返回
                if (index == 0) delay = 0; //第一个指令等待时间
                if (!ctrl.addActionOrder(new actionOrder(this.actionID, action, delay))) {

                    return;
                }
            }
            this.actionID++;

        } else {

        }

    }

    public getIsWhatching(): boolean {
        return this.isWhatching;
    }
}

import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import audioControllor from "../../Common/Audio/audioControllor";
import audioSetting from "../../Common/Audio/audioSetting";

const { ccclass, property } = cc._decorator;
const attackType = cc.Enum({
    attack: 0,
    fullAttack: 1,
    fastAttack: 2
})

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.Node)
    earthkingNode: cc.Node = null;
    @property(cc.Node)
    camera: cc.Node = null;

    @property(cc.Node)
    brother: cc.Node = null;

    @property(cc.Node)
    stoneParent: cc.Node = null;

    @property(cc.Node)
    area_1: cc.Node = null;
    @property(cc.Node)
    area_2: cc.Node = null;
    @property(cc.Prefab)
    squareStone: cc.Prefab = null;
    @property(cc.Prefab)
    triangleStone: cc.Prefab = null;

    @property(cc.Node)
    leftStone: cc.Node = null;
    @property(cc.Node)
    rightStone: cc.Node = null;

    audioSource: audioControllor = null;

    earthkingAnim: cc.Animation = null;

    start() {
        this.earthkingAnim = this.node.getComponent(cc.Animation);
        this.audioSource = cc.find("UICamera/audio").getComponent("audioControllor");

    }

    logicUpdate(dt) { }

    attackFinished() {
        this.earthkingNode.getComponent("earthKingControllor").actionFinished();

    }
    //左手攻击
    leftAttack() {
        this.area_1.active = true;
        cc.tween(this.node).delay(0.1).call(() => {
            this.area_1.active = false;
        }).start()
        this.doEarthquake();
        let currentClip = this.earthkingAnim.currentClip;
        currentClip ? console.log("=========currentClip+" + currentClip.name) : null;
        //掉落石头
        this.creatStone();
    }

    creatStone() {
        for (let index = 0; index < 2; index++) {
            let random = Math.random();
            let speed_1 = random + 0.3;

            let scale = random;
            scale = scale > 0.6 ? 0.6 : scale < 0.4 ? 0.4 : scale;
            let tri = cc.instantiate(this.triangleStone);
            let pos = this.brother.convertToWorldSpace(cc.Vec2.ZERO);
            pos = this.stoneParent.convertToNodeSpace(pos);
            tri.getComponent(cc.RigidBody).gravityScale = speed_1;
            tri.position = cc.v2(pos.x + random * 1000 - 400, pos.y + 900 + random * 1200);
            tri.scale = scale;
            tri.parent = this.stoneParent;
        }

    }

    //右手攻击
    rightAttack() {
        this.area_2.active = true;
        cc.tween(this.node).delay(0.1).call(() => {
            this.area_2.active = false;
        }).start()
        this.doEarthquake();
        this.creatStone();
        this.audioSource.playAudio(audioSetting.other.lv5.earthKing.normalAttack)
    }

    rightSlowAttack() {
        this.rightStone.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        this.doEarthquake();

        this.audioSource.playAudio(audioSetting.other.lv5.earthKing.normalAttack)
    }

    leftSlowAttack() {
        this.leftStone.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        this.doEarthquake();

        this.audioSource.playAudio(audioSetting.other.lv5.earthKing.normalAttack)
    }

    //全力攻击
    fullAttack() {
        this.area_1.active = true;
        this.area_2.active = true;
        cc.tween(this.node).delay(0.1).call(() => {
            this.area_1.active = false;
            this.area_2.active = false;
        }).start()
        this.doEarthquake();
        this.creatStone();
        //掉落石头

        this.audioSource.playAudio(audioSetting.other.lv5.earthKing.thump)
    }

    attack() {
        this.doEarthquake();
        this.creatStone();
    }

    //动作结束
    fullAttackFinished() {
        this.earthkingNode.getComponent("earthKingControllor").actionFinished();
    }


    doEarthquake() {
        let speed = 0.1;
        let pos = this.camera.position;
        let height = Math.random() * 100;
        height = height <= 40 ? 40 : height;
        let height2 = Math.random() * 100;
        height2 = height2 <= 40 ? 40 : height2;
        cc.tween(this.camera)
            .to(speed, { y: pos.y + height })
            .to(speed, { y: pos.y })
            .call(() => {
            })
            .start();
    }
}

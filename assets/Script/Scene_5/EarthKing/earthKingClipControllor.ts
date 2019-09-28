import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import audioControllor from "../../Common/Audio/audioControllor";
import audioSetting from "../../Common/Audio/audioSetting";
import { gameRecordClass } from "../../Common/BasicClass/recordClass";
import settingBasic from "../../Setting/settingBasic";
import AchievementControllor from "../../Common/Achievement/achievementControllor";

const { ccclass, property } = cc._decorator;

class stoneType {
    isMark: boolean = false;
    isRec: boolean = false;
    node: cc.Node;
    constructor(node) {
        this.node = node;
    }
}

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
    stoneList: stoneType[] = []

    //是否已获得此成就
    isGetachieve_SmartBoy = false;
    canvasCtrl: any = null;
    achieveCount: number = 0;
    start() {
        this.earthkingAnim = this.node.getComponent(cc.Animation);
        this.audioSource = cc.find("UICamera/audio").getComponent("audioControllor");

        //获取需要的次数
        this.canvasCtrl = cc.find("Canvas").getComponent("CanvasControllor");
        let rec: gameRecordClass = this.canvasCtrl.getGameRecords();
        if (rec.achievements) {
            let achieves = rec.achievements;
            achieves.forEach(e => {
                if (e.type == settingBasic.setting.achievements.Smartboy) {
                    this.isGetachieve_SmartBoy = true;
                }
            })
        }
    }

    logicUpdate(dt) {
        for (let index = 0; index < this.stoneList.length; index++) {
            let stone = this.stoneList[index];
            if (stone.node.isValid) {
                if (!this.isGetachieve_SmartBoy) {
                    //检测是否快碰到人
                    let pos1 = stone.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
                    let pos2 = this.brother.convertToWorldSpaceAR(cc.Vec2.ZERO);

                    if (!stone.isMark && Math.abs(pos1.x - pos2.x) < 100 && pos1.y - pos2.y < 250) {
                        stone.isMark = true//标记
                        // console.log("====== Mark ==index=" + index)
                    }
                    if (stone.isMark && !stone.isRec && pos1.y - pos2.y < 0) {
                        let needNum = settingBasic.setting.achievementsInit[settingBasic.setting.achievements.Smartboy].needNum;
                        // console.log("======achieve +1======= needNum= " + needNum + " ==this.achieveCount=" + this.achieveCount)
                        if (this.achieveCount < needNum) {
                            this.achieveCount++;
                            stone.isRec = true;
                            AchievementControllor.getAchieveManager().addRecord(settingBasic.setting.achievements.Smartboy)
                        } else {
                            this.isGetachieve_SmartBoy = true;
                        }
                    }
                }
            } else {
                this.stoneList.splice(index)
            }
        }
    }

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
            let speed_1 = random;
            speed_1 = speed_1 > 0.6 ? 0.6 : speed_1 < 0.3 ? 0.3 : speed_1;
            let scale = random;
            scale = scale > 0.4 ? 0.4 : scale < 0.3 ? 0.3 : scale;
            let angV = random * 100;
            angV = angV < 3 ? 3 : angV;

            let tri = cc.instantiate(this.triangleStone);
            let pos = this.brother.convertToWorldSpace(cc.Vec2.ZERO);
            pos = this.stoneParent.convertToNodeSpace(pos);
            tri.getComponent(cc.RigidBody).gravityScale = speed_1;
            tri.getComponent(cc.RigidBody).angularVelocity = angV;
            tri.position = cc.v2(pos.x + random * 1000 - 400, pos.y + 900 + random * 1200);
            tri.scale = scale;
            tri.parent = this.stoneParent;
            this.stoneList.push(new stoneType(tri))
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

import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;
const attackType = cc.Enum({
    attack: 0,
    fullAttack: 1
})

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.Node)
    earthkingNode: cc.Node = null;
    @property(cc.Node)
    camera: cc.Node = null;
    @property(cc.Node)
    area_1: cc.Node = null;
    @property(cc.Node)
    area_2: cc.Node = null;
    @property(cc.Node)
    dynamicStone: cc.Node = null;

    earthkingAnim: cc.Animation = null;

    start() {
        this.earthkingAnim = this.node.getComponent(cc.Animation);
    }

    logicUpdate(dt) { }

    attackFinished() {
        this.earthkingNode.getComponent("earthKingControllor").actionFinished();
        // console.log("======attackFinished")
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
        this.dynamicStone.getComponent("dynamicStoneControllor").createStone();
    }

    //右手攻击
    rightAttack() {
        this.area_2.active = true;
        cc.tween(this.node).delay(0.1).call(() => {
            this.area_2.active = false;
        }).start()
        this.doEarthquake();
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
        //掉落石头
        this.dynamicStone.getComponent("dynamicStoneControllor").createStone();
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

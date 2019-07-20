import settingBasic from "../../Setting/settingBasic";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    ladderTop: cc.Node = null;
    @property(cc.Node)
    ladderMid: cc.Node = null;
    @property(cc.Node)
    ladderBottom: cc.Node = null;

    isMidAction: boolean = false;
    isBottomAction: boolean = false;
    // midMoveDis: number = 210;
    BottomMoveDis: number = 210

    onLoad() {
        this.node.on(settingBasic.gameEvent.ladderActionEvent, this.laddeAction, this)
        this.ladderMid.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
    }

    start() {

    }
    laddeAction(index: number) {

        index == 1 ? this.isMidAction = true : this.isBottomAction = true;
    }

    update() {
        if (this.isMidAction) {
            this.ladderMid.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
            this.isMidAction = false;
        }

        if (this.isBottomAction) {
            this.BottomMoveDis-- > 0 ? this.ladderBottom.y++ : this.isBottomAction = false;
        }
    }
}

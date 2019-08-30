import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    pipe_left: cc.Node = null;
    @property(cc.Node)
    pipe_right: cc.Node = null;
    @property(cc.Node)
    torche: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    isGetMidOil: boolean = false; //mid是否有石油
    isGetRightOil: boolean = false; //right是否有石油

    oil_mid: cc.Node = null;
    oil_right: cc.Node = null;
    width_mid: number = 0;
    height_right: number = 0;
    start() {
        this.oil_mid = this.node.getChildByName("oil_mid");
        this.oil_right = this.pipe_right.getChildByName("oil_right");
        this.width_mid = this.node.width;
        this.height_right = this.pipe_right.height;
        //设置初始值
        //mid
        this.oil_mid.position = cc.v2(-this.width_mid / 2, 0);
        this.oil_mid.width = 0;
        //right
        this.oil_right.position = cc.v2(0, this.height_right / 2);
        this.oil_right.height = 0;

    }

    logicUpdate(dt) {

        if (!this.isGetMidOil) {

        }


    }

    //中间管子获得石油 在管子中流动
    midGetOil() {
        cc.tween(this.oil_mid).to(2, { position: cc.Vec2.ZERO, width: this.width_mid }).
            call(() => {
                this.isGetMidOil = true;
            }).
            start()
    }
    // 右边管子获得石油
    rightGetOil() {
        cc.tween(this.oil_right).to(2, { position: cc.Vec2.ZERO, height: this.height_right }).
            call(() => {
                this.isGetRightOil = true;
            }).start()
    }
}

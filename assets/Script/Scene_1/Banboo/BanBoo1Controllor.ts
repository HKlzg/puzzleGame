
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    waterMaskNode1: cc.Node = null;
    @property(cc.Node)
    waterMaskNode2: cc.Node = null;

    @property(cc.Node)
    banboo2: cc.Node = null;
    @property(cc.Node)
    banboo4: cc.Node = null;

    @property(cc.Node)
    water: cc.Node = null;

    mask1InitHeight: number = 0;
    mask2InitHeight: number = 0;

    maskTag: number = 0;
    onLoad() {

        this.mask1InitHeight = this.waterMaskNode1.height;
        this.mask2InitHeight = this.waterMaskNode2.height;

    }

    start() {

    }

    update(dt) {
        this.waterMaskContrl();

    }

    //水流 遮罩控制
    waterMaskContrl() {

        // 根据banboo 2
        let banboo2Angle = this.banboo2.angle;
        if (this.maskTag != 2 && banboo2Angle >= 150 && banboo2Angle <= 190) {
            this.water.parent = this.waterMaskNode1;
            this.water.angle = 36.8;
            this.water.setPosition(cc.v2(-139.2, -103.1))
            //控制mask 
            let maxAngle = 190 - 150;
            let height = this.mask1InitHeight - (banboo2Angle - 150) / maxAngle * (this.mask1InitHeight - 60)
            this.waterMaskNode1.height = height >= 60 ? height : 60;
            this.maskTag = 1;
        } else {
            this.maskTag = 0;
        }

        //根据banboo 4
        let banboo4Angle = this.banboo4.angle;
        if (this.maskTag != 1 && banboo4Angle >= -40 && banboo4Angle <= -20) {
            this.water.parent = this.waterMaskNode2;
            this.water.setPosition(cc.v2(-59.44, -162.77))
            this.water.angle = 70;
            //控制mask 
            let maxAngle = -20 - -40;
            let height = this.mask2InitHeight - Math.abs((-20 - banboo4Angle) / maxAngle * 130)
            // console.log("tmp= "+Math.abs((banboo4Angle - -40) / maxAngle * (this.maskInitHeight - 60))+" ===========height= "+height+"        banboo4Angle= "+banboo4Angle)
            this.waterMaskNode2.height = height >= 200 ? height : 200;
            this.maskTag = 2;
        } else {
            this.maskTag = 0;
        }
    }
  

}
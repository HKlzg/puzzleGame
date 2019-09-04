import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
const oilPos = cc.Enum({
    left: 0,
    mid: 1,
    right: 2
})
@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Node)
    pipe_left: cc.Node = null;
    @property(cc.Node)
    pipe_right: cc.Node = null;
    @property(cc.Node)
    fire: cc.Node = null;
    @property(cc.Node)
    oilClipNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    initMaskPos: cc.Vec2[] = [];
    initOilPos: cc.Vec2[] = [];
    mask: cc.Node[] = [];
    oil: cc.Node[] = [];
    maxWidth: number[] = []; //mask最大宽度
    isStartFlow: boolean[] = [false, false, false]; //是否开始流动
    isAlignment: boolean = false;//是否对齐管道
    isMaskAction: boolean[] = [false, false, false]//是否Mask在执行action
    isBurning: boolean = false; //火盆是否获得石油
    isCreateOil: boolean = false;
    isCanCreateOil: boolean = false;
    //test
    mountain: cc.Node = null;

    start() {
        //--test
        this.mountain = cc.find("Canvas/"+settingBasic.game.currScene+"Background/Mountain_left/right")
        cc.tween(this.mountain).delay(3).by(1, { y: 87 }).delay(5).
            by(1, { y: - 87 }).delay(0.5).by(1, { y: 87 }).start();
        //--

        this.mask[oilPos.left] = this.pipe_left.getChildByName("mask");
        this.mask[oilPos.mid] = this.node.getChildByName("mask");
        this.mask[oilPos.right] = this.pipe_right.getChildByName("mask");

        this.initMaskPos[oilPos.left] = this.mask[oilPos.left].position;
        this.initMaskPos[oilPos.mid] = this.mask[oilPos.mid].position;
        this.initMaskPos[oilPos.right] = this.mask[oilPos.right].position;

        this.oil[oilPos.left] = this.mask[oilPos.left].getChildByName("oil_left");
        this.oil[oilPos.mid] = this.mask[oilPos.mid].getChildByName("oil_mid");
        this.oil[oilPos.right] = this.mask[oilPos.right].getChildByName("oil_right");

        this.maxWidth[oilPos.left] = this.mask[oilPos.left].width;
        this.maxWidth[oilPos.mid] = this.mask[oilPos.mid].width;
        this.maxWidth[oilPos.right] = this.mask[oilPos.right].width;

        //设置mask初始值=0 隐藏oil
        this.mask[oilPos.mid].width = 0;
        this.mask[oilPos.right].width = 0

        this.oil.forEach(o => {
            this.initOilPos.push(o.position);
        })

        for (let index = 0; index < this.oil.length; index++) {
            let ele1 = this.oil[index];
            let ele2 = cc.instantiate(ele1);
            ele2.setPosition(cc.v2(ele1.x - ele1.width, ele1.y));
            this.mask[index].addChild(ele2);
        }
    }

    logicUpdate(dt) {
        this.checkPipePos();
        this.playLoopFlow();
    }
    //检测pipe位置
    checkPipePos() {
        let posLeft = this.mask[oilPos.left].convertToWorldSpaceAR(cc.Vec2.ZERO);
        let posMid = this.mask[oilPos.mid].convertToWorldSpaceAR(cc.Vec2.ZERO)
        posLeft.x = 0;
        posMid.x = 0;

        //只比较y轴
        if (posLeft.fuzzyEquals(posMid, 2)) { //对齐之后 mid获得石油
            if (!this.isAlignment) {
                //显示左边石油
                this.midGetOil(true);
                this.isAlignment = true;
            }
        } else {
            this.midGetOil(false);
            this.isAlignment = false;
        }

        //显示右边石油
        posMid = this.mask[oilPos.mid].convertToWorldSpaceAR(cc.Vec2.ZERO);
        let posRight = this.mask[oilPos.right].convertToWorldSpaceAR(cc.Vec2.ZERO)

        if (posMid.x + this.mask[oilPos.mid].width >= posRight.x + this.node.height / 2) {
            this.rightGetOil(true);
        }
        if (posMid.x > posRight.x) {
            this.rightGetOil(false);
        }

        //增大/变小 火焰
        let posFire = this.fire.convertToWorldSpaceAR(cc.Vec2.ZERO);
        if (posMid.x + this.mask[oilPos.mid].width >= posFire.x) {
            this.changefire(true);
        } else {
            this.changefire(false);
        }

        //产生油滴
        this.playOilClip();
    }

    //中间管子获得/失去 石油 在管子中流动 
    midGetOil(isGet: boolean) {
        if (isGet) { //获得 ============显示Mask=================
            if (!this.isStartFlow[oilPos.left]) {
                //左边石油流动 显示Mask
                this.isStartFlow[oilPos.left] = true;

            }

            if (!this.isMaskAction[oilPos.mid] && !this.isStartFlow[oilPos.mid]) {
                this.isMaskAction[oilPos.mid] = true;
                //中间石油流动 显示Mask
                this.isStartFlow[oilPos.mid] = true;

                cc.tween(this.mask[oilPos.mid]).to(1.5, { width: this.maxWidth[oilPos.mid] }).
                    call(() => {
                        this.isMaskAction[oilPos.mid] = false;
                    }).start();
            }

        } else { //失去 ==============隐藏Mask==================
            if (this.isStartFlow[oilPos.left]) {
                //左边停止循环流动
                this.isStartFlow[oilPos.left] = false;

            }

            if (!this.isMaskAction[oilPos.mid] && this.isStartFlow[oilPos.mid]) {
                this.isMaskAction[oilPos.mid] = true;

                //中间石油停止流动 隐藏Mask
                cc.tween(this.mask[oilPos.mid]).to(1.5, { width: 0, position: cc.v2(this.maxWidth[oilPos.mid] / 2, this.mask[oilPos.mid].y) }).
                    call(() => {
                        //停止循环流动
                        this.isStartFlow[oilPos.mid] = false;
                        this.mask[oilPos.mid].position = this.initMaskPos[oilPos.mid];
                        this.isMaskAction[oilPos.mid] = false;
                    }).start();
            }

        }
    }


    // 右边管子获得石油
    rightGetOil(isGet) {
        if (isGet) { //============显示Mask=================
            if (!this.isMaskAction[oilPos.right] && !this.isStartFlow[oilPos.right]) {
                this.isMaskAction[oilPos.right] = true;

                this.isStartFlow[oilPos.right] = true;
                cc.tween(this.mask[oilPos.right]).to(1.5, { width: this.maxWidth[oilPos.right] }).
                    call(() => {
                        this.isMaskAction[oilPos.right] = false;
                        //
                        this.isCanCreateOil = true;
                    }).start()
            }
        } else {//=============隐藏mask================
            if (!this.isMaskAction[oilPos.right] && this.isStartFlow[oilPos.right]) {
                this.isMaskAction[oilPos.right] = true;

                cc.tween(this.mask[oilPos.right]).delay(0.8).call(() => {
                    //停止产生油滴
                    this.isCanCreateOil = false;
                }).start()
                cc.tween(this.mask[oilPos.right]).to(1.5, { width: 0, position: cc.v2(this.maxWidth[oilPos.right] / 2, this.mask[oilPos.right].y) }).
                    call(() => {
                        //停止循环流动
                        this.isStartFlow[oilPos.right] = false;
                        this.mask[oilPos.right].position = this.initMaskPos[oilPos.right];
                        this.isMaskAction[oilPos.right] = false;

                    }).start()
            }

        }
    }


    //循环显示滚动效果
    playLoopFlow() {
        let speed = 0;
        for (let index = 0; index < this.isStartFlow.length; index++) {

            this.isStartFlow[index]

            speed = this.isStartFlow[index] ? 2 : 0;
            let bgList = this.mask[index].children;

            //index 和 oilPos 对应
            bgList.forEach(e => {
                e.x += speed;
            })

            if (speed > 0) { //向右移动
                if (bgList[0].x >= this.initOilPos[index].x + bgList[0].width) {
                    bgList.push(bgList.shift());
                    bgList[1].x = bgList[0].x - bgList[0].width + speed;
                }
            }

        }
    }

    //火焰变化
    changefire(isGetOil: boolean) {

        if (isGetOil) {
            if (this.isBurning) return;
            this.isBurning = true;
            cc.tween(this.fire).to(0.5, { scale: 1.5 }, { easing: "backIn" }).start();


        } else {
            if (!this.isBurning) return;
            this.isBurning = false;
            cc.tween(this.fire).to(0.5, { scale: 1 }).start();
        }
    }

    //滴油
    playOilClip() {
        if (this.isCanCreateOil) {
            if (this.isCreateOil) return
            this.isCreateOil = true;

            this.oilClipNode.active = true;
            let oil = cc.instantiate(this.oilClipNode.children[0]);
            oil.active = true;
            oil.width = 10;
            oil.height = 15;
            this.oilClipNode.children[1].addChild(oil);
            cc.tween(oil).to(0.8, { y: oil.y - 10, width: 35, height: 45 }).call(() => {
                this.isCreateOil = false;
                oil.addComponent(cc.RigidBody);
            }).start();
        } else {
            if (!this.isCreateOil && this.oilClipNode.childrenCount == 0) {
                this.oilClipNode.active = false;
            }
        }

    }


}

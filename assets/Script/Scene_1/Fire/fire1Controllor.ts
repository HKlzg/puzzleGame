import ArrowsService from "../../Tools/toolsBasics"

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.Float)
    time = 0;
    @property(cc.SpriteFrame)
    sprtelist = []
    
    
    lable = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {



    }

    update (dt) {
        this.time += 0.01;
        if (this.lable <= this.sprtelist.length - 1) {
            if (this.time >= 0.08) {
                this.sprite.spriteFrame = this.sprtelist[this.lable];
                this.lable += 1;
                this.time =0;
            }
        }else{
            this.lable = 0;
        }
    }

    

}

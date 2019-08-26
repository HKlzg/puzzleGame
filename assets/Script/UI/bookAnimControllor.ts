// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    book_1: cc.Node = null;
    @property(cc.Node)
    book_2: cc.Node = null;
    @property(cc.Node)
    book_3: cc.Node = null;
    @property(cc.Node)
    book_4: cc.Node = null;
    @property(cc.Node)
    book_5: cc.Node = null;
    @property(cc.Node)
    book_6: cc.Node = null;
    @property(cc.Node)
    book_7: cc.Node = null;
    @property(cc.Node)
    book_8: cc.Node = null;
    @property(cc.Node)
    book_9: cc.Node = null;

    @property(cc.Node)
    mark: cc.Node = null;
    
    @property(cc.Node)
    light: cc.Node = null;
    @property(cc.Float)
    time = 0;
    @property(cc.Float)
    id = 0;
    @property(cc.Boolean)
    play = false;


    



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    playAnim(){
        this.play = true;
        this.changePos();
    }

    update(dt) {
        if(this.play){
            this.time += 0.2;
            if (this.time >= 0.5) {
                if (this.id == 8) {
                    // this.id = 0;
                }
                this.id += 1;
                this.changePic(this.id);
                this.time = 0;
            }
        }
    }

    changePic(id) {
        if (id == 1) {
            this.book_1.active = true;
            this.book_2.active = false;
            this.book_3.active = false;
            this.book_4.active = false;
            this.book_5.active = false;
            this.book_6.active = false;
            this.book_7.active = false;
            this.book_8.active = false;
            this.book_9.active = false;
        }
        if (id == 2) {
            this.book_1.active = false;
            this.book_2.active = true;
            this.book_3.active = false;
            this.book_4.active = false;
            this.book_5.active = false;
            this.book_6.active = false;
            this.book_7.active = false;
            this.book_8.active = false;
            this.book_9.active = false;
        }
        if (id == 3) {
            this.book_1.active = false;
            this.book_2.active = false;
            this.book_3.active = true;
            this.book_4.active = false;
            this.book_5.active = false;
            this.book_6.active = false;
            this.book_7.active = false;
            this.book_8.active = false;
            this.book_9.active = false;
        }
        if (id == 4) {
            this.book_1.active = false;
            this.book_2.active = false;
            this.book_3.active = false;
            this.book_4.active = true;
            this.book_5.active = false;
            this.book_6.active = false;
            this.book_7.active = false;
            this.book_8.active = false;
            this.book_9.active = false;
        }
        if (id == 5) {
            this.book_1.active = false;
            this.book_2.active = false;
            this.book_3.active = false;
            this.book_4.active = false;
            this.book_5.active = true;
            this.book_6.active = false;
            this.book_7.active = false;
            this.book_8.active = false;
            this.book_9.active = false;
        }
        if (id == 6) {
            this.book_1.active = false;
            this.book_2.active = false;
            this.book_3.active = false;
            this.book_4.active = false;
            this.book_5.active = false;
            this.book_6.active = true;
            this.book_7.active = false;
            this.book_8.active = false;
            this.book_9.active = false;
        }
        if (id == 7) {
            this.book_1.active = false;
            this.book_2.active = false;
            this.book_3.active = false;
            this.book_4.active = false;
            this.book_5.active = false;
            this.book_6.active = false;
            this.book_7.active = true;
            this.book_8.active = false;
            this.book_9.active = false;
        }
        if (id == 8) {
            this.book_1.active = false;
            this.book_2.active = false;
            this.book_3.active = false;
            this.book_4.active = false;
            this.book_5.active = false;
            this.book_6.active = false;
            this.book_7.active = false;
            this.book_8.active = true;
            this.book_9.active = false;
        }
        if (id == 9) {
            this.book_1.active = false;
            this.book_2.active = false;
            this.book_3.active = false;
            this.book_4.active = false;
            this.book_5.active = false;
            this.book_6.active = false;
            this.book_7.active = false;
            this.book_8.active = false;
            this.book_9.active = true;
        }
    }

    changePos(){
        var movTo=cc.moveTo(1,cc.p(26,93));
        this.node.runAction(movTo);
        var rTo=cc.rotateTo(1, 0);//第一个参数也是时间参数，将节点旋转180°
        this.node.runAction(rTo);
        var scTo = cc.scaleTo(1,0.8);//将节点缩放到2倍
        this.node.runAction(scTo);
        this.mark.active = true;
        var faTo = cc.fadeTo(1, 128);
        this.light.runAction(faTo);
    }
}

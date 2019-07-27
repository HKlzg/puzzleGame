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
import settingBasic from "../../Setting/settingBasic";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Boolean)
    isleft = true;
    order: { direction: string, action: string } = null;
    // LIFE-CYCLE CALLBACKS:
    
    //更新动作
    brotherAction(msg: { direction: string, action: string }) {
        if (this.node.parent.scaleX < 0) {
            this.isleft = false;
        } else {
            this.isleft = true;
        }
    }

    moveOne(){
        if(this.isleft){
            var mto = cc.moveTo(0.6,cc.v2(this.node.parent.position.x+300,this.node.parent.position.y));
            this.node.parent.runAction(mto);
      
        }else{
            var mto = cc.moveTo(0.6,cc.v2(this.node.parent.position.x-300,this.node.parent.position.y));
            this.node.parent.runAction(mto);
        }
    }

    moveTwo(){
        if (this.isleft) {
            var mto = cc.moveTo(0.4, cc.v2(this.node.parent.position.x + 100, this.node.parent.position.y));
            this.node.parent.runAction(mto);
        } else {
    
            var mto = cc.moveTo(0.6, cc.v2(this.node.parent.position.x - 100, this.node.parent.position.y));
            this.node.parent.runAction(mto);
        }
    }

    onLoad () {

        this.node.on(settingBasic.gameEvent.brotherActionEvent, this.brotherAction, this);

    }

    update(dt){

    }
}
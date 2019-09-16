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

    @property(cc.Animation)
    monster: cc.Animation = null;
    @property(cc.Node)
    area: cc.Animation = null;


    close = false;
    start () {

    }

    
    onCollisionEnter(other, self) {
        if(other.node.name == "Tiger"){
            this.monster.getComponent("monsterClipControllor").setIsclose(true);
            this.area.getComponent("InductionAreaControl").setIsclose(true);
        }
    }
    onCollisionStay(other, self) {

    }
    onCollisionExit(other, self) {
        if(other.node.name == "Tiger"){
            this.monster.getComponent("monsterClipControllor").setIsclose(false);
            this.area.getComponent("InductionAreaControl").setIsclose(false);
        }
    }
}

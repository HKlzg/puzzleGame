import { ViewControllorBasic } from "../Common/viewControllorBasic";
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends ViewControllorBasic {
 
    start() {
        this.toolsBasics.getAudioManager().playLoopBGM("river");
    }
    loadSubPackage(){
        
    }
    //设置游戏通关步骤
    gameStep(setp){

    }
    moveStep(){}

    toUpdate(){}
}

import toolsBasics from "../../Tools/toolsBasics";
import settingBasic from "../../Setting/settingBasic";
const { ccclass, property } = cc._decorator;

@ccclass
export default class River extends cc.Component {

    @property(cc.Node)
    far_bg: Array<cc.Node> = []
    @property(cc.Float)
    far_speed = 0.2;
 
    CanvasNode :cc.Node = null;
    onLoad() {
        this.CanvasNode = cc.find("Canvas")
        toolsBasics.photoSetPos(this.far_bg[0], this.far_bg[1]);
    }

    update(dt) {
        toolsBasics.photoScroll(this.far_bg, this.far_speed);
        
        
    }
  
    
}
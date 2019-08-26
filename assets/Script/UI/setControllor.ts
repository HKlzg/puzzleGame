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
    operation: cc.Node = null;

    @property(cc.Node)
    story: cc.Node = null;

    @property(cc.Node)
    achievement: cc.Node = null;

    @property(cc.Node)
    list: cc.Node = null;

    @property(cc.Node)
    map: cc.Node = null;

    @property(cc.Node)
    operationView: cc.Node = null;

    @property(cc.Node)
    storyView: cc.Node = null;

    @property(cc.Node)
    achievementView: cc.Node = null;

    @property(cc.Node)
    listView: cc.Node = null;

    @property(cc.Node)
    mapView: cc.Node = null;
    

    @property(cc.Node)
    mapPic: cc.Node = null;

    
    @property(cc.Node)
    mapPicMask: cc.Node = null;

    @property(cc.Node)
    mapPiccopy: cc.Node = null;

    @property(cc.Node)
    book: cc.Node = null;

    isMapClick:boolean = true;

    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    mapPicOnclik(){
        if(this.isMapClick){
            this.isMapClick = false;
            this.mapPiccopy.active = true;
            var faTo = cc.fadeTo(1, 0);
            this.mapPiccopy.runAction(faTo);
            this.mapPicMask.getComponent(cc.Mask).enabled = true;
    
            cc.tween(this.mapPicMask)
               .to(2, {width: 4577, height: 4000})
             .start();
        }
    }

    bookOnClick(){
        cc.tween(this.mapPicMask)
        .to(1, {width: 388, height: 236.1})
      .start();

      cc.tween(this.mapPiccopy).delay(0.5).then(cc.fadeIn(0.5)).call(()=>{
        this.mapPicMask.getComponent(cc.Mask).enabled = false;
        cc.tween(this.mapPiccopy).delay(0).then(cc.fadeOut(0.5)).call(()=>{
            this.mapPiccopy.active = false;
            this.isMapClick = true;
        }).start();
      }).start();
    }

    operationOnclick(){
        this.operationView.active = true;
        this.storyView.active = false;
    }

    storyOnClick(){
        this.operationView.active = false;
        this.storyView.active = true;
    }

    achievementOnClick(){

    }

    listOnClick(){

    }

    mapOnClick(){

    }




    update (dt) {


    }
}

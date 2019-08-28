
const { ccclass, property } = cc._decorator;

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
    exit: cc.Node = null;

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
    bookNode: cc.Node = null;

    @property(cc.Node)
    bookMenu: cc.Node = null;

    isMapClick: boolean = true;


    // LIFE-CYCLE CALLBACKS:

    // onLoad (){}

    start() {

    }

    mapPicOnclik() {
        if (this.isMapClick) {
            this.isMapClick = false;
            this.mapPiccopy.active = true;
            this.mapPiccopy.getComponent(cc.Button).enabled = false;

            var faTo = cc.fadeTo(1, 0);
            this.mapPiccopy.runAction(faTo);
            this.mapPicMask.getComponent(cc.Mask).enabled = true;
            cc.tween(this.mapPicMask)
                .to(2, { width: 4577, height: 4000 })
                .call(() => {
                    
                })
                .start();
        }
    }

    bookOnClick() {

        cc.tween(this.mapPicMask)
            .to(1, { width: 388, height: 236.1 })
            .start();

        cc.tween(this.mapPiccopy).delay(0.5).then(cc.fadeIn(0.5)).call(() => {
            this.mapPicMask.getComponent(cc.Mask).enabled = false;
            cc.tween(this.mapPiccopy).delay(0).then(cc.fadeOut(0.5)).call(() => {
                this.mapPiccopy.active = false;
                this.isMapClick = true;
                this.mapPiccopy.getComponent(cc.Button).enabled = true;

            }).start();
        }).start();
    }

    operationOnclick() {
        this.operationView.active = true;
        this.storyView.active = false;
    }

    storyOnClick() {
        this.operationView.active = false;
        this.storyView.active = true;
    }

    achievementOnClick() {

    }

    listOnClick() {

    }

    exitClick() {
        this.bookNode.getComponent("bookNode").closeBook();
    }

    update(dt) {


    }
}


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    wxSubContextView: cc.Node = null;

    @property(cc.Node)
    rankListBt: cc.Node = null;

    @property(cc.Label)
    nickName: cc.Label = null;

    @property(cc.Sprite)
    avatar: cc.Sprite = null;

    _isShow: boolean;
    start() {
        this.initAction();
        this.initUserInfoButton();

    }

    touchStart() {
        let _showAction = cc.moveTo(0.5, this.wxSubContextView.x, 0);
        let _hideAction = cc.moveTo(0.5, this.wxSubContextView.x, -1500);

        this._isShow = !this._isShow;
        if (this._isShow) {
            this.wxSubContextView.runAction(_showAction);
        }
        else {
            this.wxSubContextView.runAction(_hideAction);
        }
    }

    initAction() {
        this._isShow = false;
        this.wxSubContextView.y = -1500; //隐藏

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.rankListBt.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
    }
    initUserInfoButton() {
        if (typeof wx === 'undefined') {
            return;
        }

        let systemInfo = wx.getSystemInfoSync();
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                lineHeight: 40,
                backgroundColor: '#00000000',
                color: '#00000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 4
            }
        });

        button.onTap((res) => {
            let userInfo = res.userInfo;
            if (!userInfo) {
                console.log("============ userInfo error:" + res.errMsg);
                return;
            }

            this.nickName.string = userInfo.nickName;

            cc.loader.load({ url: userInfo.avatarUrl, type: 'png' }, (err, texture) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.avatar.spriteFrame = new cc.SpriteFrame(texture);
            });

            wx.getOpenDataContext().postMessage({
                message: "User info get success."
            });

            let _showAction = cc.moveTo(0.5, this.wxSubContextView.x, 0);
            this.wxSubContextView.runAction(_showAction);
            this._isShow = true;

            button.hide();
            button.destroy();

        });
    }
}

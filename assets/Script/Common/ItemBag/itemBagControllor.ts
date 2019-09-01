
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const itemType = settingBasic.setting.itemType;

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.Node)
    cameraNode: cc.Node = null;
    @property(cc.Node)
    UICamera: cc.Node = null;
    @property(cc.SpriteFrame)
    picList: Array<cc.SpriteFrame> = [];

    @property(cc.Node)
    itemNode: cc.Node = null;

    camera: cc.Camera = null;
    itemList: Array<cc.Node> = [];
    // onLoad () {}
    spriteFrameList: {} = {};//顺序和 放置pic 的顺序一致

    currCtrlIndex: number = 0; //当前控制的物品 
    start() {
        this.node.on(settingBasic.gameEvent.getItemEvent, this.getItemFromScene, this);

        this.camera = this.cameraNode.getComponent(cc.Camera)

        //test
        settingBasic.fun.addItems(itemType.flower)
        settingBasic.fun.addItems(itemType.gear)
        settingBasic.fun.addItems(itemType.tear)

        this.showItems();
    }

    logicUpdate(dt) {

        // this.checkItemPos();
    }

    //显示已获得的物品
    showItems() {
        let list = settingBasic.game.inventory;

        this.picList.forEach(pic => {
            this.spriteFrameList[pic.name] = pic;
        })

        list.forEach(item => {
            //实例化预制体
            let node = cc.instantiate(this.itemNode);
            node.groupIndex = 22;
            let sprite = node.getComponent(cc.Sprite);
            let ctrl = node.getComponent("itemControllor")
            switch (item) {
                case itemType.flower:
                    sprite.spriteFrame = this.spriteFrameList["flower"];
                    ctrl.setItemType(itemType.flower)
                    break;
                case itemType.tear:
                    sprite.spriteFrame = this.spriteFrameList["tear"];
                    ctrl.setItemType(itemType.tear)
                    break;
                case itemType.gear:
                    sprite.spriteFrame = this.spriteFrameList["gear"];
                    ctrl.setItemType(itemType.gear)
                    break;
                default:
                    break;
            }
            node.active = true;
            node.setContentSize(80, 80);
            this.itemNode.parent.addChild(node);
            node.setPosition(cc.v2(this.itemList.length * 200 - 200, 0))
            this.itemList.push(node);

        });
    }

    //检测点击区域是否包含道具
    public checkItemArea(touchWorldPos: cc.Vec2): cc.Node {
        //不同camera 下的左坐标比较
        // console.log("====camera====" + this.cameraNode.position + "   ===cameraTips= " + this.UICamera.position)
        for (let index = 0; index < this.itemList.length; index++) {
            let item = this.itemList[index];

            let wordPos2 = cc.Vec2.ZERO;
            let tempVec = this.UICamera.position.sub(this.cameraNode.position);
            wordPos2 = cc.v2(touchWorldPos.x + tempVec.x, touchWorldPos.y + tempVec.y);

            let boundingBox: cc.Rect = item.getBoundingBoxToWorld();
            if (boundingBox.contains(wordPos2)) {

                this.currCtrlIndex = index;
                item.active = false;
                return item;
            }
        }
        return null;
    }

    //移除当前控制的物品
    removeCurrCtrItem(isRemove) {
        if (isRemove) {
            this.itemList.splice(this.currCtrlIndex, 1);
        } else {
            this.itemList[this.currCtrlIndex].active = true;
        }
    }


    /**
     *从场景活动道具 
     * @param type :item类别
     * @param fun 回调函数
     */
    getItemFromScene(type: number, fun: Function) {
        let item = new cc.Node();
        let sprite = item.addComponent(cc.Sprite);
        switch (type) {
            case itemType.flower:
                sprite.spriteFrame = this.spriteFrameList["flower"];
                break;
            case itemType.gear:
                sprite.spriteFrame = this.spriteFrameList["gear"];
                break;
            case itemType.tear:
                sprite.spriteFrame = this.spriteFrameList["tear"];
                break;
            default:
                break;
        }
        item.setPosition(cc.Vec2.ZERO);
        item.active = true;
        this.cameraNode.addChild(item);
        item.scale = 0.1;

        cc.tween(item).to(1, { scale: 1 }).delay(3).
            to(2, { position: cc.v2(0, -1000), scale: 0.1 }).call(() => {
                settingBasic.fun.addItems(type);
                //执行回调函数
                fun(true);
            }).start();
    }


}

import settingBasic from "../Setting/settingBasic";
import CanvasControllor from "../Common/CanvasControllor";

const { ccclass, property } = cc._decorator;
const itemID = settingBasic.setting.item.id;
const items = settingBasic.setting.item.data;

//物品类
class itemClass {
    id: number; //细分种类
    kind: string; //大类map/item/paper
    name: string;
    desc: string;
    isShow: boolean;
    spriteFrame: cc.SpriteFrame;
    constructor({ id, kind, name, desc, isShow }) {
        this.id = id;
        this.kind = kind;
        this.name = name;
        this.desc = desc;
        this.isShow = isShow;
    }
}
class sprite {
    id: number;
    name: string;
    spriteFrame: cc.SpriteFrame;
    constructor(id, name, spriteFrame) {
        this.id = id;
        this.name = name;
        this.spriteFrame = spriteFrame;
    }
}

@ccclass
export default class MapControllor extends cc.Component {
    @property(cc.Node)
    preBt: cc.Node = null;
    @property(cc.Node)
    nextBt: cc.Node = null;
    @property(cc.Prefab)
    itemPerfab: cc.Prefab = null;
    @property(cc.Prefab)
    paperPerfab: cc.Prefab = null;
    @property(cc.Node) //第五关的map 
    mapNode: cc.Node = null;

    pageNodeList: cc.Node[] = []; //页 元素从0开始 对应页数
    currPage: number = 0;

    allItemList: itemClass[] = [];  //所有 需要显示的 item
    spriteList: sprite[] = []; //所有item图片
    isLoad: boolean = true;

    private itemStorageKey: string = settingBasic.setting.storageKey.item;
    private canvasCtrl: CanvasControllor = null;


    onLoad() {
        // this.clearRecords(); //test
        this.canvasCtrl = cc.find("Canvas").getComponent("CanvasControllor")

        let self = this;
        cc.loader.loadResDir('Picture/UI/items', cc.SpriteFrame, function (err, spriteFrameList) {
            if (err) {
                console.log("加载 SpriteFrame 失败:" + JSON.stringify(err));
            } else {
                spriteFrameList.forEach(spriteFrame => {
                    let name = spriteFrame.name;
                    let id = 0;
                    for (let index = 0; index < items.length; index++) {
                        let item = items[index];
                        if (name == item.name) {
                            id = item.id;
                            break;
                        }
                    }
                    self.spriteList.push(new sprite(id, name, spriteFrame));
                });

                self.isLoad = false;
            }
        });

        //将page节点存入this.pageNodeList
        this.pageNodeList.push(this.node.getChildByName("item_page")) //item_page
        this.pageNodeList.push(this.node.getChildByName("paper_page")) //paper_page

    }

    start() {

        this.mapNode.children.forEach(map => {
            map.active = false;
        })
        //默认显示第一页
        this.changePage(this.currPage);
    }
    update(dt) {
        if (!this.isLoad) {
            this.isLoad = true;
            this.refresh();
        }
    }
    refresh() {
        //从本地存储加载记录
        let records = this.canvasCtrl.getGameRecords();
        if (records) {
            let itemlist: itemClass[] = records.items;
            if (itemlist && itemlist.length > 0) {
                //根据记录来增加item
                itemlist.forEach(item => {
                    item.isShow ? this.additem(item) : null;
                })
            }
            // console.log("===records: " + JSON.stringify(records))
        }

    }



    //增加道具
    public additem(item: itemClass) {
        let diffRec: itemClass[] = [];

        if (this.allItemList.length > 0) {
            let has = false;
            for (let index = 0; index < this.allItemList.length; index++) {
                if (this.allItemList[index].id == item.id) {
                    has = true;
                    break;
                }
            }
            if (!has) {
                diffRec.push(item);
                this.allItemList.push(item);
            }
        } else {
            diffRec.push(item);
            this.allItemList.push(item);
        }

        //增加/显示对应的不同的节点
        diffRec.forEach(difItem => {
            let spriteFrame = null;
            switch (difItem.kind) {
                case "map": //地图
                    let maps = this.mapNode.children;
                    for (let index = 0; index < maps.length; index++) {
                        let id = maps[index].getComponent("itemLogoControllor").getItemLogoID();
                        if (id == difItem.id) {
                            maps[index].active = true;
                            break;
                        }
                    }

                    break;
                case "item"://道具
                    let newItem = cc.instantiate(this.itemPerfab);
                    newItem.active = true;

                    for (let index = 0; index < this.spriteList.length; index++) {
                        let el = this.spriteList[index]
                        if (el.id == difItem.id) {
                            spriteFrame = el.spriteFrame;
                            break;
                        }
                    }
                    newItem.getComponent("itemLogoControllor").setItemLogoID(difItem.id);
                    newItem.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    let desc = newItem.getChildByName("desc");
                    desc.getComponent(cc.Label).string = difItem.desc;


                    newItem.scale = 0.4;
                    this.node.getChildByName("item_page").addChild(newItem);
                    break;
                case "paper": //纸条
                    let newPaper = cc.instantiate(this.paperPerfab);
                    newPaper.active = true;
                    newPaper.scale = 1;
                    for (let index = 0; index < this.spriteList.length; index++) {
                        let el = this.spriteList[index]
                        if (el.id == difItem.id) {
                            spriteFrame = el.spriteFrame;
                            break;
                        }
                    }
                    newPaper.getComponent("itemLogoControllor").setItemLogoID(difItem.id);
                    newPaper.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    this.node.getChildByName("paper_page").addChild(newPaper);
                    break;
                default:
                    break;
            }
        })
        this.saveRecords();
    }

    //上一页
    prePage() {
        this.currPage--;
        this.currPage = this.currPage > 0 ? this.currPage : 0;
        this.changePage(this.currPage);
    }
    //下一页
    nextPage() {
        this.currPage++;
        this.currPage = this.currPage < this.pageNodeList.length - 1 ? this.currPage : this.pageNodeList.length - 1;
        this.changePage(this.currPage);
    }

    //翻页
    changePage(pageIndex: number) {
        for (let index = 0; index < this.pageNodeList.length; index++) {
            this.pageNodeList[index].active = pageIndex == index;
            this.preBt.active = pageIndex != 0;
            this.nextBt.active = pageIndex != this.pageNodeList.length - 1;
        }
    }

    saveRecords() {
        this.canvasCtrl.saveRecords(this.itemStorageKey, this.allItemList)
    }

}

import settingBasic from "../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
const itemType = settingBasic.setting.itemType;
//物品类
class item {
    type: number;
    isMap: boolean;
    pageNum: number;
    isShow: boolean;
    constructor(type, isMap?: boolean, pageNum?) {
        this.isMap = isMap;
        this.type = type;
        this.isShow = false;
        this.pageNum = pageNum > -1 ? pageNum : -1;
    }
}

class itemNode {
    type: number;
    node: cc.Node;
    constructor(type, node) {
        this.type = type;
        this.node = node;
    }
}

@ccclass
export default class MapControllor extends cc.Component {
    @property(cc.Node)
    preBt: cc.Node = null;
    @property(cc.Node)
    nextBt: cc.Node = null;

    @property(cc.Node) //第五关的map
    mapNode: cc.Node = null;

    pageNodeList: cc.Node[] = []; //页 元素从0开始 对应页数
    currPage: number = 0;
    allItemList: itemNode[] = [];  //所有item节点
    allItemRecordList: item[] = []; //所有item记录

    private itemStorageKey: string = settingBasic.setting.storageKey.item;


    onLoad() {
        // this.clearRecords(); //test

        //将page节点存入this.pageNodeList
        this.node.children.forEach(e => {
            e.name.substr(0, 4) == "page" ? this.pageNodeList.push(e) : null;
        })

        //将当前节点下的所有 item存入allItemRecordList
        for (let index = 0; index < this.pageNodeList.length; index++) {
            const page = this.pageNodeList[index];
            page.children.forEach(node => {
                let itemCtrl = node.getComponent("itemLogoControllor"); //通过标志脚本来获取类别
                if (itemCtrl) {
                    let type = itemCtrl.getItemLogoType();
                    this.allItemRecordList.push(new item(type, false, index));

                    this.allItemList.push(new itemNode(type, node));
                }
                node.active = false; //设置item最初为不显示
            })
        }
        //将map下的item 存入item存入allItemRecordList
        this.mapNode.children.forEach(node => {
            let itemCtrl = node.getComponent("itemLogoControllor"); //通过标志脚本来获取类别
            if (itemCtrl) {
                let type = itemCtrl.getItemLogoType();
                this.allItemRecordList.push(new item(type, true, -1));

                this.allItemList.push(new itemNode(type, node)); //生成初始记录
            }
            node.active = false; //设置item最初为不显示
        })

        //从本地存储加载记录
        let records = cc.sys.localStorage.getItem(this.itemStorageKey)
        if (records) {
            let itemlist: item[] = JSON.parse(records);
            if (itemlist.length > 0) {
                //根据记录来显示item
                itemlist.forEach(item => {

                    this.allItemList.forEach(itemNode => {
                        let type = itemNode.node.getComponent("itemLogoControllor").getItemLogoType();
                        if (type == item.type && item.isShow) itemNode.node.active = true;
                    })

                    //更改初始记录
                    this.allItemRecordList.forEach(e => {
                        if (e.type == item.type) {
                            e.isMap = item.isMap;
                            e.pageNum = item.pageNum;
                            e.isShow = item.isShow;
                        };
                    })

                })
            }
            // console.log("==load== " + records)
        }
        // console.log("==== " + JSON.stringify(this.allItemRecordList))
        //默认显示第一页
        this.changePage(this.currPage);
    }

    start() {


    }


    //获得map道具 map(0-3)
    public getitem(type: number) {

        for (let index = 0; index < this.allItemRecordList.length; index++) {
            const item = this.allItemRecordList[index];
            if (item.type == type) {
                item.isShow = true;

                this.allItemList.forEach(itemNode => {
                    let type = itemNode.node.getComponent("itemLogoControllor").getItemLogoType();
                    if (type == item.type && item.isShow) itemNode.node.active = true;
                })
            }
        }
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
        cc.sys.localStorage.setItem(this.itemStorageKey, JSON.stringify(this.allItemRecordList))
    }
    clearRecords() {
        cc.sys.localStorage.removeItem(this.itemStorageKey)
    }


}

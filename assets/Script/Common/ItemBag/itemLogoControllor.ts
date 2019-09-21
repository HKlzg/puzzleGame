import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
const itemLogeId = settingBasic.setting.item.id;

//主要用于UI显示的 物品标识
@ccclass
export default class NewClass extends cc.Component {

    @property({ type: itemLogeId, displayName: "物品ID" })
    itemLogoID: number = itemLogeId.lv1_paper;

    start() {

    }

    getItemLogoID() {
        return this.itemLogoID;
    }
    setItemLogoID(id: number) {
        return this.itemLogoID = id;
    }
 

}

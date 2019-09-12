import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
const itemLogeType = settingBasic.setting.itemType;
//主要用于UI显示的 物品标识
@ccclass
export default class NewClass extends cc.Component {

    @property({ type: itemLogeType, displayName: "物品类型" })
    itemLogo: number = itemLogeType.Lv1_paper;

    start() {

    }

    getItemLogoType() {
        return this.itemLogo;
    }
}

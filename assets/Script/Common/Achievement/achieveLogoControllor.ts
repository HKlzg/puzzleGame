import settingBasic from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;
const achieveTyps = settingBasic.setting.achievements;
//仅仅只是成就 logo 的标识
@ccclass
export default class NewClass extends cc.Component {

    @property({ type: achieveTyps })
    achieveType = achieveTyps.TimeCollector;


    start() {

    }

    public getLogo() {
        return this.achieveType;
    }
    // update (dt) {}
}

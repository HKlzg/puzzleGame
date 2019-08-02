import { BrotherBasic } from "../../Common/Brother/brotherBasic"

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends BrotherBasic {


    start() {

    }
    //重写
    toUpdate() { };

    //重写
    rayCheck() { };
}

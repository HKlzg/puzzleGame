import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
const attackType = cc.Enum({
    attack: 0,
    fullAttack: 1
})
//动作指令类型
class actionOrder {
    id: number; //一组动作的标志ID
    action: number;
    delay: number; //延迟
    constructor(id: number, action: number, delay?: number) {
        this.id = id;
        this.action = action;
        this.delay = delay ? delay : 0;
    }
}

const { ccclass, property } = cc._decorator;
//控制earthKing 的动作
@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.Node)
    earthkingClip: cc.Node = null;

    earthkingAnim: cc.Animation = null;
    isDoAction: boolean = false;
    actionQueue: actionOrder[] = []; //动作指令队列 先进先出 执行后删除
    // onLoad () {}
    currActionID: number = -1;//当前执行组的动作ID
    start() {
        this.earthkingAnim = this.earthkingClip.getComponent(cc.Animation);
    }

    logicUpdate(dt) {

        this.doAction();
    }
    //按队列顺序执行
    doAction() {
        if (!this.isDoAction && this.actionQueue.length > 0) {
            let order = this.actionQueue[0]; //只取第一个 
            cc.tween(this.node).delay(order.delay).call(() => {
                this.doActionOnce(order.action);
            }).start();
        }
    }

    //执行一次
    doActionOnce(actionType: number) {
        if (!this.isDoAction) {
            this.isDoAction = true;

            switch (actionType) {
                case attackType.attack:
                    this.earthkingAnim.play("attackClip")

                    break;
                case attackType.fullAttack:
                    this.earthkingAnim.play("fullAttackClip")

                    break;
                default:
                    break;
            }

        }
    }
    //添加动作指令
    public addActionOrder(order: actionOrder): boolean {
        //
        if (this.currActionID > 0 && order.id != this.currActionID) return false;
        this.actionQueue.push(order);
        this.currActionID = order.id;
        // console.log("======add order= " + order.action + "  id=" + order.id)
        return true;
    }
    //外部调用 动作完成
    public actionFinished() {
        this.isDoAction = false;

        //从队列中移除第一个
        if (this.actionQueue.length > 0) {
            let order = this.actionQueue.shift();
            // console.log("====remove order: " + order.action);
        } else {
            // console.log("====actionQueue finish======");
            this.currActionID = -1;
        }
    }
}

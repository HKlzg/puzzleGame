import { LogicBasicComponent } from "../../Common/LogicBasic/LogicBasicComponent";
const attackType = cc.Enum({
    attack: 0,
    fullAttack: 1,
    fastAttack: 2
})

const state = cc.Enum({
    state1: 0,
    state2: 1,
    state3: 2,
    stop: 3,
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
    @property(cc.Node)
    brother: cc.Node = null;

    currState = state.stop;
    earthkingAnim: cc.Animation = null;
    isDoAction: boolean = false;
    actionQueue: actionOrder[] = []; //动作指令队列 先进先出 执行后删除
    // onLoad () {}
    currActionID: number = -1;//当前执行组的动作ID

    start() {
        this.earthkingAnim = this.earthkingClip.getComponent(cc.Animation);
        // this.doActionOnce(attackType.attack);
    }

    logicUpdate(dt) {
        if (this.currState == state.state3) {
            this.doAction();
        }
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
                case attackType.fastAttack:
                    this.earthkingAnim.play("fastAttackClip")
                    break;
                default:
                    break;
            }

        }
    }

    changeState() {
        if (this.currState == state.stop) {
            this.currState = state.state1;
            this.doActionOnce(attackType.attack);
        }
        else if (this.currState == state.state1) {
            this.currState = state.state2;
            this.isDoAction = false;
            cc.tween(this.node).by(1, { y: -700 }).call(() => {
                this.node.x = 1392;
            }).by(1, { y: 950 }).call(() => { this.doActionOnce(attackType.fastAttack); }).start();
        } else if (this.currState == state.state2) {
            this.currState = state.state3;
            this.isDoAction = false;
            cc.tween(this.node).by(1, { y: -950 }).call(() => {
                this.node.x = 2673;
            }).by(1.5, { y: 700 }).start();
        }
    }

    public getState() {
        return this.currState;
    }

    //添加动作指令
    public addActionOrder(order: actionOrder): boolean {
        //
        if (this.actionQueue.length > 4) return false;
        this.actionQueue.push(order);
        // this.currActionID = order.id;
        return true;
    }
    //外部调用 动作完成
    public actionFinished() {
        this.isDoAction = false;

        //从队列中移除第一个
        if (this.actionQueue.length > 0) {
            let order = this.actionQueue.shift();
         } else {
            // this.currActionID = -1;
        }
    }
}

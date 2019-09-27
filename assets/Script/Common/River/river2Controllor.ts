import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

class point {
    maxLen: number = 0;
    startPos: cc.Vec2 = cc.Vec2.ZERO;
    endPos: cc.Vec2 = cc.Vec2.ZERO;
    node: cc.Node = null;
    parent: cc.Node = null;
    isMoving: boolean = false;
    constructor(node: cc.Node) {
        this.node = node;
        this.maxLen = this.node.width;
        this.parent = this.node.parent;
        this.startPos = cc.v2(-this.parent.width / 2, this.node.position.y);
        this.endPos = cc.v2((this.parent.width / 2) - this.maxLen / 2, this.node.position.y);
    }
}

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(cc.Float)
    speed: number = 0.5;

    childrens: point[] = [];

    start() {
        this.node.children.forEach(node => {
            this.childrens.push(new point(node))
        });
    }

    logicUpdate(dt) {
        this.childrens.forEach(pot => {
            if (!pot.isMoving) {
                pot.isMoving = true;

                let time = (pot.parent.width / 2 - pot.node.position.x) / 100 * this.speed;
                let time2 = (pot.parent.width / 2) / 150 * (this.speed / 2);

                if (pot.node.width != 0) {
                    cc.tween(pot.node)
                        .to(time, { position: pot.endPos })
                        .to(time2, { x: (pot.parent.width / 2), width: 0 })
                        .call(() => {
                            pot.isMoving = false;
                            pot.node.position = pot.startPos;
                        }).start()
                } else {
                    let time1 = (pot.maxLen / 2) / 83 * this.speed * 2;
                    cc.tween(pot.node)
                        .by(time1, { x: pot.maxLen / 2, width: pot.maxLen })
                        .to(time, { position: pot.endPos })
                        .to(time2, { x: (pot.parent.width / 2), width: 0 })
                        .call(() => {
                            pot.isMoving = false;
                            pot.node.position = pot.startPos;
                        }).start()
                }
            }

        });

    }
}

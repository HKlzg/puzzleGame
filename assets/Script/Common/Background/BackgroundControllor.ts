
const { ccclass, property } = cc._decorator;
import toolsBasics from "../../Tools/toolsBasics";
import settingBasic from "../../Setting/settingBasic";

const actionType = settingBasic.setting.actionType;
const actionDirection = settingBasic.setting.actionDirection;

@ccclass
export class BackgroundControllor extends cc.Component {

    @property(cc.Node)
    cameraNode: cc.Node = null;
    //box
    @property(cc.Prefab)
    boxShadowPerfab: cc.Prefab = null;
    @property(cc.Node)
    brotherNode: cc.Node = null;
    @property(cc.Node)
    Mask: cc.Node = null;
    @property(cc.Node)
    circular: cc.Node = null;
    @property(cc.Node)
    boxParent: cc.Node = null;

    //Brother Move 
    minX: number = 0;
    minY: number = 0;
    maxX: number = 0;
    maxY: number = 0;

    boxMaxNum: number = 0; //最大箱子个数
    camera: cc.Camera = null;
    boxShadow: cc.Node = null;
    BackgroundSize: cc.Size = null;
    toolsBasics = toolsBasics;
    settingBasic = settingBasic;

    startpos: cc.Vec2 = null;
    endpos: cc.Vec2 = null;

    //显示圈范围

    rDis: number = 300;  // 半径
    drawline: cc.Node = null;

    //角色状态
    playerStateType = settingBasic.setting.roleState;
    //当前角色状态
    playerState = 0;

    longTouchTime: number = 0;
    isLongTouchBegin: boolean = false;
    longTouchStartPos: cc.Vec2 = null;
    preTouchId: number;
    prePlayerOrder: { direction: number, action: number, msg?: any } = null;

    canvas: cc.Node = null;
    textTips: cc.Label = null;

    onLoad() {
        //------Camera-------
        this.camera = this.cameraNode.getComponent(cc.Camera);
        //获取背景大小
        this.BackgroundSize = this.node.getContentSize();

        this.canvas = this.node.parent;
        let cameraSize = this.canvas.getContentSize();
        //以世界坐标作参考 镜头移动的界限坐标
        let bgWorldPos = this.node.convertToWorldSpace(cc.Vec2.ZERO);
        this.minX = bgWorldPos.x + cameraSize.width / 2;
        this.minY = bgWorldPos.y + cameraSize.height / 2;
        this.maxX = bgWorldPos.x + this.BackgroundSize.width - cameraSize.width / 2;
        this.maxY = bgWorldPos.y + this.BackgroundSize.height - cameraSize.height / 2;

        // 设置初始camera位置 
        let pos = this.canvas.convertToNodeSpaceAR(cc.v2(this.minX + this.brotherNode.width / 2, this.minY))
        this.cameraNode.setPosition(pos);
        this.cameraControllor();
        //使用background 注册事件,是为了 防止点击canvas区域之外时无效的情况
        //触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)

        this.playerState = this.playerStateType.Stop;

        //显示圆圈参数
        this.drawline = this.circular.getChildByName("DrawLine");
        this.rDis = this.circular.width / 2;
        this.boxMaxNum = settingBasic.fun.getBoxNumByLv(settingBasic.game.currLevel);
        this.textTips = this.cameraNode.getChildByName("tip").getComponent(cc.Label);
        this.textTips.string = "Box: " + this.boxMaxNum;
    };

    start() {

    };

    //#endregion
    update(dt) {
        if (this.playerState != this.playerStateType.LongTouch) {
            this.cameraControllor();
        }
        if (this.isLongTouchBegin ) {
            this.longTouchTime++;

            if (this.startpos.equals(this.endpos) && this.longTouchTime > 20) {
                this.isLongTouchBegin = false;
                this.playerState = this.playerStateType.LongTouch;

                //产生boxShadow
                this.createBoxShadow();

            }
        }
    };

    cameraControllor() {
        //限定相机移动区域 防止越界 世界坐标系
        let cameraPos = this.cameraNode.convertToWorldSpace(cc.v2(0, 0))
        let movePos = this.cameraNode.position;
        //X
        let broPosWorld = this.brotherNode.convertToWorldSpace(cc.v2(0, 0))
        if (cameraPos.x >= this.minX && cameraPos.x <= this.maxX) {

            if (broPosWorld.x >= this.minX
                && broPosWorld.x <= this.maxX) {

                movePos = this.cameraNode.parent.convertToNodeSpaceAR(broPosWorld);
                movePos = cc.v2(movePos.x, this.cameraNode.position.y)
            } else {
                movePos = this.cameraNode.position;
            }
        } else {
            if (broPosWorld.x < this.minX) {
                movePos = this.node.convertToNodeSpaceAR(cc.v2(this.minX, cameraPos.y));
                movePos = cc.v2(movePos.x, movePos.y);
            }
            if (broPosWorld.x > this.maxX) {
                movePos = this.node.convertToNodeSpaceAR(cc.v2(this.maxX, cameraPos.y));
            }
        }
        //Y
        // if (cameraPos.y >= this.minY && cameraPos.y <= this.maxY) {

        //     if (broPosWorld.y >= this.minY
        //         && broPosWorld.y <= this.maxY) {

        //         movePos = cc.v2(movePos.x, this.brotherNode.y);
        //     } else {
        //         movePos = cc.v2(movePos.x, this.cameraNode.y);
        //     }
        // } else {
        //     let pos = cc.v2(0, 0);
        //     if (cameraPos.y < this.minY) {
        //         pos = this.node.convertToNodeSpaceAR(cc.v2(0, this.minY));
        //     }
        //     if (cameraPos.y > this.maxY) {
        //         pos = this.node.convertToNodeSpaceAR(cc.v2(0, this.maxY));
        //     }
        //     movePos = cc.v2(movePos.x, pos.y)
        // }
        // console.log("======cameraPos=" + cameraPos + "        movePos ==" + movePos)
        this.cameraNode.setPosition(movePos);

    }


    //事件分发
    //----------------------------touch event ---------------------------
    touchStart(event) {
        //若当前事件的touchID 和其他触摸事件ID 不一致 则返回
        if (this.preTouchId && event.getID() != this.preTouchId) return

        //可以触发人物触摸移动事件
        if (this.playerState != this.playerStateType.LongTouch) {
            this.playerStart(event);
        }
        //可以触发箱子触摸事件
        if (this.playerState == this.playerStateType.Stop) {
            this.boxTouchStart(event);
        }

    }

    touchMove(event) {
        this.playerMove(event);
        this.boxTouchMove(event);
    }

    touchEnd(event) {
        this.playerStop(event);
        this.boxTouchEnd(event);
    }


    //-------------------------------player Event-----------------------------
    playerStart(event) {
        this.startpos = event.touch.getLocation();
        this.endpos = event.touch.getLocation();

        this.camera.getCameraToWorldPoint(this.startpos,this.startpos)
        this.camera.getCameraToWorldPoint(this.endpos,this.endpos)

    }

    playerMove(event) {

        this.endpos = event.touch.getLocation();
        this.camera.getCameraToWorldPoint(this.endpos,this.endpos)

        if (this.playerState == this.playerStateType.LongTouch) return
        //手机一直触发此事件
        this.playerState = this.playerStateType.Moving;

        //若当前事件的touchID 和其他触摸事件ID 不一致 则返回
        if (this.preTouchId && event.getID() != this.preTouchId) return
  
        let order: { direction: number, action: number } = { direction: actionDirection.Right, action: actionType.Wait };
        let direction = actionDirection.Right;

        /******滑动方向检测 */
        let currpos = cc.v2(this.endpos.x - this.startpos.x, this.endpos.y - this.startpos.y);
        let distance = toolsBasics.distanceVector(this.startpos, this.endpos);

        if (distance > 10) {
            let angle = toolsBasics.vectorsToDegress(currpos);

            if (angle >= -45 && angle < 45) {
                direction = actionDirection.Right;

            } else if (angle > -90 && angle <= -45) {
                direction = actionDirection.Up_Right;

            } else if (angle <= -90 && angle >= -135) {
                direction = actionDirection.Up_Left;

            }
            else if ((angle > -180 && angle <= -135) || (angle > 135 && angle <= 180)) {
                direction = actionDirection.Left;
            }
        }else{
            return;
        }

        switch (direction) {

            case actionDirection.Up_Left: //向左上
                order = { direction: direction, action: actionType.Jump };
                break;
            case actionDirection.Up_Right: //向右上
                order = { direction: direction, action: actionType.Jump };
                break;
            case actionDirection.Down: //向下
                order = { direction: direction, action: actionType.Climb };
                break;
            case actionDirection.Left://向左
                order = { direction: direction, action: actionType.Walk };
                break;
            case actionDirection.Right://向右
                order = { direction: direction, action: actionType.Walk };
                break;

            default:
                break;
        }

        if (!this.prePlayerOrder || (this.prePlayerOrder.direction != order.direction
            || this.prePlayerOrder.direction != order.direction)) {
            this.prePlayerOrder = order
            this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
            // console.log("=======direction=" + direction)
        }

    }

    playerStop(event) {
        // console.log("=======playerStop===")
        this.endpos = null;
        this.prePlayerOrder = null;
        this.playerState = this.playerStateType.Stop

        if (this.preTouchId && event.getID() != this.preTouchId) return

        let playerPos = this.brotherNode.convertToWorldSpace(cc.Vec2.ZERO);
        let touchPos = event.touch.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos)

        let order: { direction: number, action: number } = null;
        let direction = actionDirection.Right;

        if (playerPos.x < touchPos.x) {
            direction = actionDirection.Right
        }
        if (playerPos.x > touchPos.x) {
            direction = actionDirection.Left
        }
        order = { direction: direction, action: actionType.Wait }
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
    }

    //-------------------------------Box Event----------------------------
    boxToDistanceBoY(): cc.Vec2 {
        //拿到borther和box的位置求距离来限制箱子生成的范围
        let vector = cc.Vec2.ZERO;
        let bortherpos = this.brotherNode.convertToWorldSpace(cc.v2(0, 0));
        let boxpos = this.endpos;
        let gra = this.drawline.getComponent(cc.Graphics);

        //切换动作
        let dire = boxpos.x >= bortherpos.x ? actionDirection.Right : actionDirection.Left;
        let order: { direction: number, action: number } = { direction: dire, action: actionType.MAGIC }
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)

        vector = toolsBasics.calcBoxPosFromCircle(bortherpos, boxpos, this.rDis, gra, this.boxParent);
        return vector;
    }

    // 产生箱子
    createBoxShadow() {
        if (this.boxMaxNum > 0) {
            this.playerState = this.playerStateType.LongTouch
            this.boxShadow ? this.boxShadow.removeFromParent() : null;
            let touchPos = this.longTouchStartPos;
            this.camera.getCameraToWorldPoint(touchPos, touchPos)
            this.boxShadow = cc.instantiate(this.boxShadowPerfab)
            this.boxShadow.scale = 0.1
            this.boxShadow.parent = this.boxParent;
            this.boxShadow.runAction(cc.scaleTo(0.1, 1, 1));

            touchPos = this.boxParent.convertToNodeSpaceAR(touchPos);
            this.boxShadow.setPosition(this.boxToDistanceBoY());

        } else {
            let bortherpos = this.brotherNode.convertToWorldSpace(cc.v2(0, 0));
            let boxpos = this.endpos;

            //切换动作
            let dire = boxpos.x >= bortherpos.x ? actionDirection.Right : actionDirection.Left;
            let order: { direction: number, action: number } = { direction: dire, action: actionType.No_Magic }
            this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)

        }

    }

    boxTouchStart(event) {
        this.longTouchStartPos = event.touch.getLocation();
        this.isLongTouchBegin = true;
        this.longTouchTime = 0;

    }

    boxTouchMove(event) {
        if (this.playerState == this.playerStateType.Moving) return
        //若当前事件的touchID 和其他触摸事件ID 不一致 则返回
        if (this.preTouchId && event.getID() != this.preTouchId) return

        this.isLongTouchBegin = false;

        if (!this.boxShadow) return;
        let touchPos = event.touch.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos)
        touchPos = this.boxParent.convertToNodeSpaceAR(touchPos);
        this.boxShadow.setPosition(this.boxToDistanceBoY());
    }

    boxTouchEnd(event) {
        this.playerState = this.playerStateType.Stop
        this.isLongTouchBegin = false;
        this.longTouchTime = 0;
        this.drawline.getComponent(cc.Graphics).clear();
        if (this.boxShadow) {
            this.boxShadow.emit(settingBasic.gameEvent.instanceBoxEvent, "", (isOk) => {
                if (this.boxMaxNum == 0) return;
                isOk ? this.boxMaxNum-- : null;
                this.textTips.string = "Box:" + this.boxMaxNum;
            });
        }
        this.boxShadow = null;
    }


}

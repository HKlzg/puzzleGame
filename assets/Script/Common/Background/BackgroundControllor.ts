
const { ccclass, property } = cc._decorator;
import toolsBasics from "../../Tools/toolsBasics";
import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const actionType = settingBasic.setting.actionType;
const actionDirection = settingBasic.setting.actionDirection;

@ccclass
export class BackgroundControllor extends LogicBasicComponent {

    @property(cc.Node)
    cameraNode: cc.Node = null;
    //box
    @property(cc.Prefab)
    boxShadowPerfab: cc.Prefab = null;
    @property(cc.Node)
    brotherNode: cc.Node = null;
    // @property(cc.Node)
    // Mask: cc.Node = null;
    @property(cc.Node)
    circular: cc.Node = null;

    @property(cc.Node)
    keyNodeList: Array<cc.Node> = [];

    UICamera: cc.Node = null;
    actionMask: cc.Node = null;
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
    //角色是否死亡
    isDeath: boolean = false;
    isOrder: boolean = false; //是否已经发射命令

    longTouchTime: number = 0;
    isLongTouchBegin: boolean = false;
    longTouchStartPos: cc.Vec2 = null;
    preTouchId: number;
    prePlayerOrder: { direction: number, action: number, msg?: any } = null;

    canvas: cc.Node = null;
    boxTip: cc.Label = null;

    brotherPrePos: cc.Vec2 = null;

    isStartGame: boolean = false;
    keyNodeIndex: number = 0;
    initCameraPos: cc.Vec2 = null;
    cameraAnimation: cc.Animation = null;

    onLoad() {

        //------Camera-------
        this.camera = this.cameraNode.getComponent(cc.Camera);
        this.cameraAnimation = this.cameraNode.getComponent(cc.Animation);
        //获取背景大小
        this.BackgroundSize = this.node.getContentSize();

        this.canvas = cc.find("Canvas");
        this.actionMask = cc.find("UICamera/actionMask")
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
        this.initCameraPos = this.cameraNode.position;

        this.playerState = this.playerStateType.Stop;

        //显示圆圈参数
        this.drawline = this.circular.getChildByName("DrawLine");
        this.rDis = this.circular.width / 2;
        this.boxMaxNum = settingBasic.fun.getBoxNumByLv(settingBasic.game.currLevel);
        this.UICamera = cc.find("UIMask").getChildByName("UICamera")

        //自动根据此背景大小修正box mask 大小
        this.node.parent.getChildByName("Box").setContentSize(this.node.getContentSize())
    };

    start() {
        // this.moveCamera();
        this.isStartGame = true;
        this.closeAllEvents(1, null, 350); //test
        if (settingBasic.game.currLevel == 1) {
        }
        

    };

    //#endregion
    logicUpdate(dt) {

        if (this.playerState != this.playerStateType.LongTouch) {
            this.cameraControllor();
        }

    };

    cameraControllor() {
        //限定相机移动区域 防止越界 世界坐标系
        let cameraPos = this.cameraNode.convertToWorldSpaceAR(cc.v2(0, 0))
        let movePos = this.cameraNode.position;
        //X
        let broPosWorld: cc.Vec2 = this.brotherNode.convertToWorldSpaceAR(cc.v2(0, 0));

        if (this.brotherPrePos && this.brotherPrePos.fuzzyEquals(broPosWorld, 1)) return;
        this.brotherPrePos = broPosWorld;

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

        this.cameraNode.setPosition(movePos);

    }

    //事件分发
    //----------------------------touch event ---------------------------
    touchStart(event) {

        if (!this.isStartGame) return;
        //若当前事件的touchID 和其他触摸事件ID 不一致 则返回
        if (this.preTouchId && event.getID() != this.preTouchId) return
        //是否在重生中 (死亡状态)
        this.isDeath = settingBasic.game.State == settingBasic.setting.stateType.REBORN;

        if (this.isDeath) return

        //可以触发人物触摸移动事件
        if (this.playerState != this.playerStateType.LongTouch) {
            this.playerStart(event);
        }


    }

    touchMove(event) {
        if (!this.isStartGame) return;
        if (this.isDeath) return
        this.playerMove(event);
    }

    touchEnd(event) {
        if (!this.isStartGame) return;
        this.playerStop(event);
    }


    //-------------------------------player Event-----------------------------
    playerStart(event) {
        this.startpos = event.touch.getLocation();
        this.endpos = event.touch.getLocation();

        this.startpos = this.camera.getCameraToWorldPoint(this.startpos, this.startpos)
        this.endpos = this.camera.getCameraToWorldPoint(this.endpos, this.endpos)
        this.isOrder = false;
    }

    playerMove(event) {
        if (this.isOrder) return;

        this.endpos = event.touch.getLocation();
        this.camera.getCameraToWorldPoint(this.endpos, this.endpos)

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

        if (distance > 50) {
            let angle = toolsBasics.vectorsToDegress(currpos);

            if (angle >= -15 && angle < 15) {
                direction = actionDirection.Right; //水平向右

            } else if (angle >= -75 && angle < -15) {
                direction = actionDirection.Up_Right; //右上

            } else if (angle < -75 && angle >= -105) { //垂直向上
                direction = actionDirection.Up;

            } else if (angle >= -165 && angle < -105) { //左上
                direction = actionDirection.Up_Left;

            } else if ((angle >= -180 && angle < -165) || (angle >= 165 && angle <= 180)) {//水平向左
                direction = actionDirection.Left;

            } else if (angle >= 105 && angle < 165) { //左下方
                direction = actionDirection.Down_left;

            } else if (angle >= 15 && angle < 75) { //右下方
                direction = actionDirection.Down_Right;

            } else if (angle >= 75 && angle < 105) { //垂直向下
                direction = actionDirection.Down;
            }
        } else {
            return;
        }

        switch (direction) {
            case actionDirection.Up: //向上
                order = { direction: direction, action: actionType.Jump };
                break;
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
            case actionDirection.Down_Right://向右下
                order = { direction: direction, action: actionType.QuietlyWalk };
                break;
            case actionDirection.Down_left://向左下
                order = { direction: direction, action: actionType.QuietlyWalk };
                break;
            default:
                break;
        }

        if (!this.prePlayerOrder || (this.prePlayerOrder.direction != order.direction
            || this.prePlayerOrder.direction != order.direction)) {
            this.prePlayerOrder = order;
            this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order);
            this.isOrder = true;
            // console.log("=======direction=" + direction)
        }

    }

    playerStop(event) {
        // console.log("=======playerStop===")
        this.endpos = null;
        this.prePlayerOrder = null;
        this.playerState = this.playerStateType.Stop
        this.isOrder = false;
        if (this.preTouchId && event.getID() != this.preTouchId) return

        // let playerPos = this.brotherNode.convertToWorldSpace(cc.Vec2.ZERO);
        let touchPos = event.touch.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos)

        let order: { direction: number, action: number } = null;
        let direction = actionDirection.Right;

        if (this.startpos.x < touchPos.x) {
            direction = actionDirection.Right
        }
        if (this.startpos.x > touchPos.x) {
            direction = actionDirection.Left
        }
        order = { direction: direction, action: actionType.Wait }
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
    }


    //屏蔽所有事件 3秒之后再次启用
    /**
     * 
     * @param direction 人物方向 1/-1 
     * @param fun 回调函数
     * @param dist 行走距离 ,不给或者给0 时,自动计算距离
     * @param passType 通道类型 "IN"/"OUT"
     */
    closeAllEvents(direction, fun?, dist?, passType?) {

        this.actionMask.active = true;
        //#region 
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)
        //#endregion
        this.brotherNode.emit(settingBasic.gameEvent.brotherTransitionEvent, dist, 2, direction, () => {
            this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
            this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)
            this.actionMask.active = false;
            fun ? fun() : null;
        }, passType)

    }

}


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
  
    UICamera: cc.Node = null;
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
    boxParent: cc.Node = null;

    @property(cc.Node)
    keyNodeList: Array<cc.Node> = [];

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

    //道具
    isTouchItem: boolean = false; //是否控制的是 道具
    items: Array<cc.Node> = [];
    onLoad() {

        //------Camera-------
        this.camera = this.cameraNode.getComponent(cc.Camera);
        this.cameraAnimation = this.cameraNode.getComponent(cc.Animation);
        //获取背景大小
        this.BackgroundSize = this.node.getContentSize();

        this.canvas = cc.find("Canvas");
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
        this.UICamera = cc.find("UIMask").getChildByName("UICamera")
        this.boxTip = this.UICamera.getChildByName("boxTip").getComponent(cc.Label);
        this.boxTip.string = "箱子数量:" + this.boxMaxNum;

    };

    start() {
        this.moveCamera();
    };

    //#endregion
    logicUpdate(dt) {

        if (this.playerState != this.playerStateType.LongTouch) {
            this.cameraControllor();
        }
        if (this.isLongTouchBegin) {
            this.longTouchTime++;

            if (this.startpos.equals(this.endpos) && this.longTouchTime > 20) {
                this.isLongTouchBegin = false;
                this.playerState = this.playerStateType.LongTouch;

                if (!this.checkLongTouchArea(this.endpos)) {
                    //产生boxShadow
                    this.createBoxShadow();
                }

            }
        }
    };
    //检测长按区域是否包含道具
    checkLongTouchArea(touchPos): boolean {
        let itembag = this.UICamera.getChildByName("itemsBag");
        if (!itembag) return false;
        let returnObj: cc.Node = itembag.getComponent("itemBagControllor").checkItemArea(touchPos);

        //返回一个实例的item
        if (returnObj) {
            // console.log("=========checkLongTouchArea===itemType="+returnObj.getComponent("itemControllor").getItemType())
            this.boxShadow = cc.instantiate(returnObj);
            //重新给itemType赋值
            let itemType = returnObj.getComponent("itemControllor").getItemType();
            // console.log("===itemType="+itemType)
            this.boxShadow.getComponent("itemControllor").setItemType(itemType);

            this.boxShadow.active = true;
            this.boxShadow.groupIndex = 3;
            let collider: any = null;
            collider = this.boxShadow.getComponent(cc.PhysicsCircleCollider);
            if (!collider) {
                collider = this.boxShadow.getComponent(cc.PhysicsBoxCollider);
                if (!collider) {
                    collider = this.boxShadow.getComponent(cc.PhysicsPolygonCollider);
                }
            }
            if (collider) {
                collider.sensor = true;
                collider.apply();
            }

            this.boxShadow.parent = this.boxParent;
            this.boxShadow.setPosition(this.boxToDistanceBoY());
            let scale = this.boxShadow.scale;
            cc.tween(this.boxShadow).to(0.1, { scale: scale + 0.2 }).to(0.1, { scale: scale }).start();
            this.isTouchItem = true;
        } else {
            this.isTouchItem = false;
        }
        return this.isTouchItem;

    }

    //引导镜头 显示关键点
    moveCamera() {
        let isShow = !settingBasic.game.isShowKeyPos;

        if (!isShow || !this.keyNodeList || (this.keyNodeList && this.keyNodeList.length == 0)) {
            cc.tween(this.cameraNode).to(1, { position: this.initCameraPos }, { easing: "cubicInOut" }).start();
            this.isStartGame = true;

            return
        } else {
            let cameraPos = this.cameraNode.position;
            let cameraWorPos = this.cameraNode.convertToWorldSpace(cc.Vec2.ZERO);

            let keyNode = this.keyNodeList[this.keyNodeIndex];
            let keyPos = keyNode.convertToWorldSpaceAR(cc.Vec2.ZERO);

            let dist = Math.abs(cameraWorPos.x - keyPos.x);
            let time = 4 * dist / 1200;
            time = time > 4 ? 4 : time;
            time = time < 0.5 ? 0.5 : time;

            //镜头放大缩小    
            cc.tween(this.cameraNode).delay(time + 0.3).call(() => {
                this.cameraAnimation.play("zoomInOut").speed = 0.8;
            }).start();

            keyPos = this.cameraNode.parent.convertToNodeSpaceAR(keyPos);
            keyPos.y = cameraPos.y;

            cc.tween(this.cameraNode).to(time, { position: keyPos }, { easing: "quartInOut" }).call(() => {
            }).delay(2).call(() => {
                this.keyNodeIndex++;
                if (this.keyNodeIndex == this.keyNodeList.length) {
                    cc.tween(this.cameraNode).to(1, { position: this.initCameraPos }, { easing: "cubicInOut" }).start();
                    this.isStartGame = true;

                } else {
                    this.moveCamera();
                }
            }).start();


        }
    }

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
        if (!this.isStartGame) return;
        //若当前事件的touchID 和其他触摸事件ID 不一致 则返回
        if (this.preTouchId && event.getID() != this.preTouchId) return
        // this.preTouchId = event.getID();
        //是否在重生中 (死亡状态)
        this.isDeath = settingBasic.game.State == settingBasic.setting.stateType.REBORN;

        if (this.isDeath) return

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
        if (!this.isStartGame) return;
        if (this.isDeath) return
        this.playerMove(event);
        this.boxTouchMove(event);
    }

    touchEnd(event) {
        if (!this.isStartGame) return;
        this.playerStop(event);
        this.boxTouchEnd(event);

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

    //-------------------------------Box Event----------------------------
    boxToDistanceBoY(): cc.Vec2 {
        //拿到borther和box的位置求距离来限制箱子生成的范围
        let vector = cc.Vec2.ZERO;
        let bortherpos = this.brotherNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let boxpos = this.endpos;
        let gra = this.drawline.getComponent(cc.Graphics);

        //切换动作
        let dire = boxpos.x >= bortherpos.x ? actionDirection.Right : actionDirection.Left;
        this.brotherNode.scaleX = boxpos.x >= bortherpos.x ? 1 : -1;
        let order: { direction: number, action: number } = { direction: dire, action: actionType.MAGIC }
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)

        vector = toolsBasics.calcBoxPosFromCircle(bortherpos, boxpos, this.rDis, gra, this.boxParent);
        return vector;
    }

    // 产生箱子
    createBoxShadow() {
        if (this.boxMaxNum > 0) {
            this.playerState = this.playerStateType.LongTouch
            this.boxShadow ? this.boxShadow.destroy() : null;
            let touchPos = this.longTouchStartPos;
            this.camera.getCameraToWorldPoint(touchPos, touchPos)
            this.boxShadow = cc.instantiate(this.boxShadowPerfab)
            this.boxShadow.scale = 0.1
            this.boxShadow.parent = this.boxParent;
            this.boxShadow.runAction(cc.scaleTo(0.1, 1, 1));

            // touchPos = this.boxParent.convertToNodeSpaceAR(touchPos);
            this.boxShadow.setPosition(this.boxToDistanceBoY());

        } else {
            let bortherpos = this.brotherNode.convertToWorldSpaceAR(cc.v2(0, 0));
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

        if (this.isTouchItem) {
            this.boxShadow.getComponent("itemControllor").startMove(event)
        } else {

        }

    }

    boxTouchMove(event) {

        if (this.playerState == this.playerStateType.Moving) return
        //若当前事件的touchID 和其他触摸事件ID 不一致 则返回
        if (this.preTouchId && event.getID() != this.preTouchId) return

        this.isLongTouchBegin = false;

        if (!this.boxShadow) return;

        if (this.isTouchItem) {
            this.boxShadow.getComponent("itemControllor").moveItem(event)
        } else {

            // let touchPos = event.touch.getLocation();
            // this.camera.getCameraToWorldPoint(touchPos, touchPos)
            // touchPos = this.boxParent.convertToNodeSpaceAR(touchPos);
            this.boxShadow.setPosition(this.boxToDistanceBoY());
        }
    }

    boxTouchEnd(event) {
        this.playerState = this.playerStateType.Stop
        this.isLongTouchBegin = false;
        this.longTouchTime = 0;
        this.drawline.getComponent(cc.Graphics).clear();

        if (this.isTouchItem) {
            //控制的是物品栏的道具
            //获取当前item状态
            let itemCtrl = this.boxShadow.getComponent("itemControllor");
            let isforbidden = itemCtrl.getIsForbidden();
            if (!isforbidden) {
                this.boxShadow.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                let collider: any = null;
                collider = this.boxShadow.getComponent(cc.PhysicsCircleCollider);
                if (!collider) {
                    collider = this.boxShadow.getComponent(cc.PhysicsBoxCollider);
                    if (!collider) {
                        collider = this.boxShadow.getComponent(cc.PhysicsPolygonCollider);
                    }
                }
                if (collider) {
                    collider.sensor = false;
                    collider.apply();
                }
                // 注册点击事件
                itemCtrl.registEvent(true);
                //从物品栏移除当前物品
                let itembag = this.UICamera.getChildByName("itemsBag");
                itembag.getComponent("itemBagControllor").removeCurrCtrItem(true);
                //添加到 当前场景中保存
                this.items.push(this.boxShadow);

            } else {
                this.boxShadow.destroy();
                //恢复 显示物品
                let itembag = this.UICamera.getChildByName("itemsBag");
                itembag.getComponent("itemBagControllor").removeCurrCtrItem(false);
            }

            itemCtrl.stopMove(event); //调用本身的 stop 事件

            this.isTouchItem = false;
        } else {
            //控制的是Box
            if (this.boxShadow) {
                this.boxShadow.emit(settingBasic.gameEvent.instanceBoxEvent, "", (isOk) => {
                    if (this.boxMaxNum == 0) return;
                    isOk ? this.boxMaxNum-- : null;
                    this.boxTip.string = "箱子数量:" + this.boxMaxNum;
                });
                //设置isPlaying = false
                this.brotherNode.emit(settingBasic.gameEvent.brotherPlayState, false)
                let dire = this.brotherNode.scaleX > 0 ? actionDirection.Right : actionDirection.Left;
                this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, { direction: dire, action: actionType.Wait })
            }

        }
        this.boxShadow = null;
        if (this.boxShadow) {
            this.boxShadow.destroy()
        }
    }


}

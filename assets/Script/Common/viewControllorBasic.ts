
const { ccclass, property } = cc._decorator;
import toolsBasics from "../Tools/toolsBasics";
import settingBasic from "../Setting/settingBasic";

const leveList = settingBasic.setting.level

@ccclass
export abstract class ViewControllorBasic extends cc.Component {

    @property({ type: cc.Enum(leveList), displayName: "关卡设定" })
    public level = leveList.lv1;

    @property(cc.Node)
    cameraNode: cc.Node = null;
    //box
    @property(cc.Prefab)
    boxShadowPerfab: cc.Prefab = null;
    @property(cc.Node)
    brotherNode: cc.Node = null;
    @property(cc.Node)
    background: cc.Node = null;
    //Brother Move 
    minX: number = 0;
    minY: number = 0;
    maxX: number = 0;
    maxY: number = 0;

    boxShadow: cc.Node = null;
    camera: cc.Camera = null;
    BackgroundSize: cc.Size = null;
    public boxParent: cc.Node = null;
    public toolsBasics = toolsBasics;
    public settingBasic = settingBasic;
    public stateType = settingBasic.setting.stateType;

    public stepList: Array<string> = [];
    public startpos: cc.Vec2 = null;
    public endpos: cc.Vec2 = null;

    //镜头移动方向
    cameraMoveDirection: string = "";

    //显示圈范围
    drawline: cc.Node = null;
    rDis: number = 300;  // 半径
    circular: cc.Node = null;

    // //切换角色之前的镜头坐标
    // lastCameraPos: cc.Vec2 = cc.v2(0, 0);
    // isMoveCamera: boolean = false;

    //角色状态
    playerStateType = settingBasic.setting.roleState;
    //当前角色状态
    playerState = 0;
    // isPlayerMove: boolean = false;

    longTouchTime: number = 0;
    // isLongTouch: boolean = false;
    isLongTouchBegin: boolean = false;
    longTouchStartPos: cc.Vec2 = null;
    //#region onload
    preTouchId: number;
    prePlayerOrder: { direction: string, action: string } = null;


    onLoad() {
        console.log("=========SCENE: " + this.level + " ==========")
        //加载子包资源
        this.loadSubPackageDefualt();

        //开启物理系统 ----------必须写在onLoad 里面
        cc.director.getPhysicsManager().enabled = true;

        // // //绘制碰撞区域
        // var draw = cc.PhysicsManager.DrawBits;
        // cc.director.getPhysicsManager().debugDrawFlags = draw.e_shapeBit | draw.e_jointBit;
        // //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;


        // 自定义事件 控制游戏状态 
        this.node.on(settingBasic.gameEvent.gameStateEvent, this.changeGameState, this);
        this.node.on(settingBasic.gameEvent.gameStepEvent, this.gameStep, this);
        this.node.on(settingBasic.gameEvent.gameMoveStep, this.moveStep, this);
        this.node.on(settingBasic.gameEvent.setCurrGameStep, this.setCurrGameStep, this);

        //------Camera-------
        this.camera = this.cameraNode.getComponent(cc.Camera);
        //获取背景大小
        this.BackgroundSize = this.background.getContentSize();
        //camera 和canvas size一样
        let cameraSize = this.node.getContentSize();
        //以世界坐标作参考 镜头移动的界限坐标
        let bgWorldPos = this.background.convertToWorldSpace(cc.Vec2.ZERO);
        this.minX = bgWorldPos.x + cameraSize.width / 2;
        this.minY = bgWorldPos.y + cameraSize.height / 2;
        this.maxX = bgWorldPos.x + this.BackgroundSize.width - cameraSize.width / 2;
        this.maxY = bgWorldPos.y + this.BackgroundSize.height - cameraSize.height / 2;
        // 设置初始camera位置 
        let pos = this.node.convertToNodeSpaceAR(cc.v2(this.minX + this.brotherNode.width / 2, this.minY))
        this.cameraNode.setPosition(pos);
        this.cameraControllor();
        // this.lastCameraPos = this.cameraNode.position;

        //使用background 注册事件,是为了 防止点击canvas区域之外时无效的情况
        //触摸事件
        this.background.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
        this.background.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)

        this.playerState = this.playerStateType.Stop;
        this.boxParent = this.node.getChildByName("Mask");
        //显示圆圈参数
        this.drawline = this.node.getChildByName("Line");
        this.circular = this.node.getChildByName("Circular");
        this.rDis = this.circular.width / 2;
    };
    //#endregion

    //#region start
    start() {
        // cc.view.getDesignResolutionSize();
        // cc.view.getFrameSize();
        this.node.emit(settingBasic.gameEvent.gameStateEvent, this.stateType.START);
    };


    //#endregion
    update(dt) {
        if (this.playerState != this.playerStateType.LongTouch) {

            // if (!this.isMoveCamera) {
            this.cameraControllor();
            // } else if (!this.cameraNode.position.equals(this.lastCameraPos)) {
            //相机归位
            //     cc.tween(this.cameraNode).to(0.3, { position: this.lastCameraPos }).start();
            //     this.isMoveCamera = false;
            // }
        }
        if (this.isLongTouchBegin /*&& this.playerState == this.playerStateType.Stop*/) {
            this.longTouchTime++;

            if (this.startpos.equals(this.endpos) && this.longTouchTime > 20) {
                this.isLongTouchBegin = false;
                this.playerState = this.playerStateType.LongTouch;

                //产生boxShadow
                this.createBoxShadow()
            }
        }
        this.toUpdate();
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
        if (cameraPos.y >= this.minY && cameraPos.y <= this.maxY) {

            if (broPosWorld.y >= this.minY
                && broPosWorld.y <= this.maxY) {

                movePos = cc.v2(movePos.x, this.brotherNode.y);
            } else {
                movePos = cc.v2(movePos.x, this.cameraNode.y);
            }
        } else {
            let pos = cc.v2(0, 0);
            if (cameraPos.y < this.minY) {
                pos = this.node.convertToNodeSpaceAR(cc.v2(0, this.minY));
            }
            if (cameraPos.y > this.maxY) {
                pos = this.node.convertToNodeSpaceAR(cc.v2(0, this.maxY));
            }
            movePos = cc.v2(movePos.x, pos.y)
        }
        // console.log("======cameraPos=" + cameraPos + "        movePos ==" + movePos)
        this.cameraNode.setPosition(movePos);

    }

    abstract toUpdate();

    loadSubPackageDefualt() {
        //加载资源 子包
        // cc.loader.downloader.loadSubpackage('Audio', function (err) {
        //     if (err) {
        //         return console.error("----Audio---------" + err);
        //     }
        // });
        // //加载资源 子包
        // cc.loader.downloader.loadSubpackage('Picture', function (err) {
        //     if (err) {
        //         return console.error("----Picture---------" + err);
        //     }
        // });

        this.loadSubPackage();
    };
    //子类实现之后 加载额外的子包
    abstract loadSubPackage();

    //更改当前游戏状态
    changeGameState(state) {
        settingBasic.game.State = state;
        // console.log("================state="+state);
        switch (state) {
            case this.stateType.START:
                console.log("==========GAME START==========")
                break;
            case this.stateType.NEXT:
                //切换到下一个场景
                let nextLevel = this.level + 1;
                if (settingBasic.setting.level[nextLevel]) {
                    settingBasic.game.currLevel = nextLevel;
                } else {
                    settingBasic.game.currLevel = -1; //通关
                }
                cc.director.loadScene("loading")
                break;
            case this.stateType.PAUSE:

                break;
            case this.stateType.RESUME:

                break;
            case this.stateType.OVER:
                console.log("==========GAME OVER==========")


                //注销事件
                // this.node.off(cc.Node.EventType.TOUCH_START, this.playerService.touchStart, this.playerService);
                // this.node.off(cc.Node.EventType.TOUCH_MOVE, this.playerService.touchMove, this.playerService);
                // this.node.off(cc.Node.EventType.TOUCH_END, this.playerService.touchEnd, this.playerService);

                break;
            default:
                break;
        }
    }
    //记录当前移动的
    setCurrGameStep(step: string) {
        this.stepList.push(step);
    };
    //开启游戏机关 步骤
    abstract gameStep(setp: string);
    //人物移动步骤
    abstract moveStep(setp: number);
    //检测是否包含*步骤
    isContainsStep(step: string): boolean {
        // console.log("============stepList =" + this.stepList.toString()+"   step="+step);
        for (let index = 0; index < this.stepList.length; index++) {
            if (this.stepList[index] == step) {
                return true;
            }
        }
        return false;
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
    }

    playerMove(event) {

        this.endpos = event.touch.getLocation();
        // console.log(this.endpos+"this endpos move");
        // console.log("==playerMove start== getID=" + event.getID())
        if (this.playerState == this.playerStateType.LongTouch) return
        //手机一直触发此事件
        this.playerState = this.playerStateType.Moving;

        //若当前事件的touchID 和其他触摸事件ID 不一致 则返回
        if (this.preTouchId && event.getID() != this.preTouchId) return


        let playerPos = this.brotherNode.convertToWorldSpace(cc.v2(0, 0));
        let touchPos = event.touch.getLocation();
        //将当前camera坐标下的event 坐标转换到世界坐标
        this.camera.getCameraToWorldPoint(touchPos, touchPos)

        let order: { direction: string, action: string } = { direction: "R", action: "WAIT" };
        let direction = "S";

        /******滑动方向检测 */

        let currpos = cc.v2(this.endpos.x - this.startpos.x, this.endpos.y - this.startpos.y);
        let distance = toolsBasics.distanceVector(this.startpos, this.endpos);

        if (distance > 10) {
            let angle = toolsBasics.vectorsToDegress(currpos);

            if (angle >= -45 && angle < 45) {
                direction = "R";
            } else if (angle > -90 && angle <= -45) {
                direction = "RU";
            } else if (angle <= -90 && angle >= -135) {
                direction = "LU";
            }
            else if ((angle > -180 && angle <= -135) || (angle > 135 && angle <= 180)) {
                direction = "L";
            }
        }

        // console.log("==direction=" + direction + "===========playerPos=" + playerPos + "======touchPos==" + touchPos);
        switch (direction) {
            case "S":
                order = { direction: "R", action: "WAIT" };
                break;

            case "LU": //向上
                order = { direction: "LU", action: "JUMP" };
                break;
            case "RU": //向上
                order = { direction: "RU", action: "JUMP" };
                break;
            case "D": //向下
                order = { direction: "D", action: "CLIMB" };
                break;
            case "L"://向左
                order = { direction: "L", action: "WALK" };
                break;
            case "R"://向右
                order = { direction: "R", action: "WALK" };
                break;

            default:
                break;
        }
        if (direction != "S") {
            if (!this.prePlayerOrder || (this.prePlayerOrder.direction != order.direction
                || this.prePlayerOrder.direction != order.direction)) {
                this.prePlayerOrder = order
                console.log("=======direction=" + direction)
                this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
                this.brotherNode.getChildByName("Brother_Walk").emit(settingBasic.gameEvent.brotherActionEvent, order);
            }
        }
    }

    playerStop(event) {
        //放置箱子时不能移动
        // if (this.isLongTouch) return
        console.log("=======playerStop===")
        this.endpos = null;
        this.prePlayerOrder = null;
        this.playerState = this.playerStateType.Stop

        if (this.preTouchId && event.getID() != this.preTouchId) return

        let playerPos = cc.v2(0, 0);
        let touchPos = event.touch.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos)

        let order: { direction: string, action: string } = null;
        let direction = "R";

        if (playerPos.x < touchPos.x) {
            direction = "R"
        }
        if (playerPos.x > touchPos.x) {
            direction = "L"
        }
        order = { direction: direction, action: "WAIT" }
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
    }

    //-------------------------------Box Event----------------------------
    boxToDistanceBoY(): cc.Vec2 {
        let vector = cc.Vec2.ZERO;
        //拿到borther和box的位置求距离来限制箱子生成的范围
        let bortherpos = this.brotherNode.convertToWorldSpace(cc.v2(0, 0));
        let boxpos = this.camera.getCameraToWorldPoint(this.endpos, this.endpos);

        let dis = toolsBasics.distanceVector(bortherpos, boxpos);

        if (dis >= this.rDis) {
            let angle = boxpos.sub(bortherpos).angle(cc.v2(this.rDis, 0));
            vector.x = bortherpos.x + this.rDis * Math.cos(angle);
            vector.y = bortherpos.y <= boxpos.y ?
                bortherpos.y + this.rDis * Math.sin(angle) :
                bortherpos.y - this.rDis * Math.sin(angle);
        } else {
            vector = boxpos;
        }
        let gra = this.drawline.getComponent(cc.Graphics);
        gra.clear();
        gra.moveTo(bortherpos.x, bortherpos.y);
        gra.lineTo(vector.x, vector.y);

        gra.stroke();
        return this.boxParent.convertToNodeSpaceAR(vector);
    }

    // 产生箱子
    createBoxShadow() {
        {
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

            //切换动作
            let dire = touchPos.x >= this.brotherNode.x ? "R" : "L";
            let order: { direction: string, action: string } = { direction: dire, action: "MAGIC" }
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
        //boxShadow到边缘时移动镜头
        // let cameraSize = this.node.getContentSize();
        //向左移动
        // if (this.boxShadow.x - this.boxShadow.width / 2 <= this.cameraNode.x - cameraSize.width / 2) {
        //     this.cameraMoveDirection = "L"
        // } else if (this.boxShadow.x + this.boxShadow.width / 2 >= this.cameraNode.x + cameraSize.width / 2) {
        //     //向右移动
        //     this.cameraMoveDirection = "R"
        // } else {
        //     this.cameraMoveDirection = "S"
        // }

    }

    boxTouchEnd(event) {
        this.playerState = this.playerStateType.Stop
        this.isLongTouchBegin = false;
        this.longTouchTime = 0;
        this.drawline.getComponent(cc.Graphics).clear();
        if (this.boxShadow) {
            this.boxShadow.emit(settingBasic.gameEvent.instanceBoxEvent, "");
        }
        this.boxShadow = null;
    }


}

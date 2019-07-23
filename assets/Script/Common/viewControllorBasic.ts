
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
        this.minX = cameraSize.width / 2 - (this.BackgroundSize.width - cameraSize.width) / 2;
        this.minY = cameraSize.height / 2 - (this.BackgroundSize.height - cameraSize.height) / 2;
        this.maxX = (this.BackgroundSize.width - cameraSize.width) / 2 + cameraSize.width / 2;
        this.maxY = (this.BackgroundSize.height - cameraSize.height) / 2 + cameraSize.height / 2;

        // 设置初始camera位置 
        let pos = this.node.convertToNodeSpaceAR(cc.v2(this.minX + this.brotherNode.width / 2, this.minY))
        this.cameraNode.setPosition(pos);
        this.cameraControllor();
        // this.lastCameraPos = this.cameraNode.position;

        //使用background 注册事件,是为了 防止点击canvas区域之外时无效的情况
        //控制player移动
        this.background.on(cc.Node.EventType.TOUCH_START, this.playerStart, this)
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.playerMove, this)
        this.background.on(cc.Node.EventType.TOUCH_END, this.playerStop, this)
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.playerStop, this)

        //Box 触摸事件
        this.boxParent = this.node.getChildByName("Mask");
        this.background.on(cc.Node.EventType.TOUCH_START, this.boxTouchStart, this)
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.boxTouchMove, this)
        this.background.on(cc.Node.EventType.TOUCH_END, this.boxTouchEnd, this)
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.boxTouchEnd, this)

        this.playerState = this.playerStateType.Stop;
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
        if (this.isLongTouchBegin && this.playerState == this.playerStateType.Stop) {
            this.longTouchTime++;

            if (this.longTouchTime > 20 && this.playerState != this.playerStateType.LongTouch) {

                this.playerState = this.playerStateType.LongTouch;

                //产生boxShadow
                this.createBoxShadow()
            }

        }

        this.toUpdate();
    };

    cameraControllor() {
        //限定相机移动区域 防止越界
        let cameraPos = this.cameraNode.convertToWorldSpace(cc.v2(0, 0))
        let movePos = this.cameraNode.position;
        //X
        let broPosWorld = this.brotherNode.convertToWorldSpace(cc.v2(0, 0))
        if (cameraPos.x >= this.minX && cameraPos.x <= this.maxX) {

            if (broPosWorld.x - this.brotherNode.width / 2 >= this.minX
                && broPosWorld.x + this.brotherNode.width / 2 <= this.maxX) {

                movePos = cc.v2(this.brotherNode.x, this.cameraNode.y);
            } else {
                movePos = this.cameraNode.position;
            }
        } else {
            if (cameraPos.x < this.minX) {
                movePos = this.node.convertToNodeSpaceAR(cc.v2(this.minX, cameraPos.y));
            }
            if (cameraPos.x > this.maxX) {
                movePos = this.node.convertToNodeSpaceAR(cc.v2(this.maxX, cameraPos.y));
            }
        }
        //Y
        if (cameraPos.y >= this.minY && cameraPos.y <= this.maxY) {

            if (broPosWorld.y + this.brotherNode.height / 2 >= this.minY
                && broPosWorld.y + this.brotherNode.height / 2 <= this.maxY) {

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

    //-------------------------------player Event-----------------------------
    playerStart(event) {
        if (this.playerState == this.playerStateType.LongTouch) return
        //若当前事件的touchID 和其他触摸事件ID 不一致 则返回
        if (this.preTouchId && event.getID() != this.preTouchId) return
        this.startpos = event.touch.getLocation();
    }

    playerMove(event) {
        // console.log("==playerMove start== getID=" + event.getID())
        if (this.playerState == this.playerStateType.LongTouch) return
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
        this.endpos = event.touch.getLocation();
        let currpos = cc.v2(this.endpos.x - this.startpos.x, this.endpos.y - this.startpos.y);
        let distance = toolsBasics.distanceVector(this.startpos, this.endpos);

        if (distance > 10) {
            let angle = toolsBasics.vectorsToDegress(currpos);

            if (angle >= -45 && angle < 45) {
                direction = "R";
            } else if (angle > -135 && angle <= -45) {
                direction = "U";
            } else if ((angle > -180 && angle <= -135) || (angle > 135 && angle <= 180)) {
                direction = "L";
            }
        }

        // console.log("==direction=" + direction + "===========playerPos=" + playerPos + "======touchPos==" + touchPos);
        switch (direction) {
            case "S":
                order = { direction: "R", action: "WAIT" };
                break;

            case "U": //向上
                order = { direction: "U", action: "JUMP" };
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
                console.log("=======direction=" + direction + "   distance= " + distance)
                this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
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
            this.boxShadow.setPosition(touchPos);

            //切换动作
            let dire = touchPos.x >= this.brotherNode.x ? "R" : "L";
            let order: { direction: string, action: string } = { direction: dire, action: "MAGIC" }
            this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
        }

    }

    boxTouchStart(event) {
        //若当前事件的touchID 和其他触摸事件ID 不一致 则返回
        if (this.preTouchId && event.getID() != this.preTouchId) return
        //人物移动时不能触发
        if (this.playerState == this.playerStateType.Stop) {
            this.longTouchStartPos = event.touch.getLocation();
            this.isLongTouchBegin = true;
            this.longTouchTime = 0;
        }

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
        this.boxShadow.setPosition(touchPos);

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

        if (this.boxShadow) {
            this.boxShadow.emit(settingBasic.gameEvent.instanceBoxEvent, "");
        }
        this.boxShadow = null;

    }


}

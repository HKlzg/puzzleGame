
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
    public toolsBasics = toolsBasics;
    public settingBasic = settingBasic;
    public stateType = settingBasic.setting.stateType;

    public stepList: Array<string> = [];
    public RoleType = settingBasic.setting.roleType
    public currRole = settingBasic.setting.roleType.leadingRole;

    //镜头移动方向
    cameraMoveDirection: string = "";
    //切换角色之前的镜头坐标
    lastCameraPos: cc.Vec2 = cc.v2(0, 0);
    isMoveCamera: boolean = false;
    onLoad() {
        console.log("=========SCENE: " + this.level + " ==========")
        //加载子包资源
        this.loadSubPackageDefualt();

        //开启物理系统 ----------必须写在onLoad 里面
        cc.director.getPhysicsManager().enabled = true;

        // //绘制碰撞区域
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
        //获取背景大小
        this.camera = this.cameraNode.getComponent(cc.Camera);
        // let Background = this.background;
        this.BackgroundSize = this.background.getContentSize();
        //camera 和canvas size一样
        let cameraSize = this.node.getContentSize();
        //以世界坐标作参考 镜头移动的界限坐标
        this.minX = cameraSize.width / 2 - (this.BackgroundSize.width - cameraSize.width) / 2;
        this.minY = cameraSize.height / 2 - (this.BackgroundSize.height - cameraSize.height) / 2;
        this.maxX = (this.BackgroundSize.width - cameraSize.width) / 2 + cameraSize.width / 2;
        this.maxY = (this.BackgroundSize.height - cameraSize.height) / 2 + cameraSize.height / 2;

        // 设置初始camera位置 

        let pos = this.node.convertToNodeSpaceAR(cc.v2(this.minX, this.minY))
        this.cameraNode.setPosition(pos);
        this.lastCameraPos = this.cameraNode.position;

        //使用background 注册事件,是为了 防止点击canvas区域之外时无效的情况
        //控制player移动
        this.background.on(cc.Node.EventType.TOUCH_START, this.playerMove, this)
        this.background.on(cc.Node.EventType.TOUCH_END, this.playerStop, this)
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.playerStop, this)

        //Box 触摸事件
        this.background.on(cc.Node.EventType.TOUCH_START, this.thouchStart, this)
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.thouchMove, this)
        this.background.on(cc.Node.EventType.TOUCH_END, this.thouchEnd, this)
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.thouchEnd, this)

        //切换角色事件
        this.node.on(settingBasic.gameEvent.gameRoleEvent, this.changeRole, this);

    };

    start() {
        // cc.view.getDesignResolutionSize();
        // cc.view.getFrameSize();

        this.node.emit(settingBasic.gameEvent.gameStateEvent, this.stateType.START);
    };

    update(dt) {

        if (this.currRole == this.RoleType.leadingRole) {
            //角色1
            if (!this.isMoveCamera) {
                this.cameraControllor();
            } else if (!this.cameraNode.position.equals(this.lastCameraPos)) {

                cc.tween(this.cameraNode).to(0.3, { position: this.lastCameraPos }).start();
                this.isMoveCamera = false;
            }
        } else if (this.boxShadow) {
            //角色2
            let moveSpeed = 5;
            let cameraWorldPos = this.cameraNode.convertToWorldSpace(cc.v2(0, 0));

            if (this.cameraMoveDirection == "L") {
                cameraWorldPos.x > this.minX + moveSpeed * 5 ?
                    this.cameraNode.runAction(cc.moveBy(0, cc.v2(-moveSpeed, this.cameraNode.y))) : null;

            } else if (this.cameraMoveDirection == "R") {
                cameraWorldPos.x < this.maxX - moveSpeed * 5 ?
                    this.cameraNode.runAction(cc.moveBy(0, cc.v2(moveSpeed, this.cameraNode.y))) : null;
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
    changeRole(role) {
        if (role == this.RoleType.leadingRole) {
            this.isMoveCamera = true;
        } else if (role == this.RoleType.assistant) {
            this.lastCameraPos = this.cameraNode.position; //记录
        }
        this.currRole = role;

    }

    playerMove(event) {
        // console.log("==playerMove start==")
        if (this.currRole != this.RoleType.leadingRole) return

        let playerPos = this.brotherNode.convertToWorldSpace(cc.v2(0, 0));
        let touchPos = event.touch.getLocation();
        //将当前camera坐标下的event 坐标转换到世界坐标
        this.camera.getCameraToWorldPoint(touchPos, touchPos)

        let order: { direction: string, action: string } = { direction: "R", action: "WAIT" };
        let direction = "S";

        if (playerPos.x < touchPos.x) {
            direction = "R"
        }
        if (playerPos.x > touchPos.x) {
            direction = "L"
        }
        // if (playerPos.y < touchPos.y) {
        //     direction = "U"
        // }
        // if (playerPos.y > touchPos.y) {
        //     direction = "D"
        // }

        // console.log("==direction=" + direction + "===========playerPos=" + playerPos + "======touchPos==" + touchPos);
        switch (direction) {
            case "S":
                order = { direction: "R", action: "WAIT" };
                break;
            case "U":
                order = { direction: "U", action: "CLIMB" };
                break;
            case "D":
                order = { direction: "D", action: "CLIMB" };
                break;
            case "L":
                order = { direction: "L", action: "WALK" };
                break;
            case "R":
                order = { direction: "R", action: "WALK" };
                break;
            default:
                break;
        }
        // console.log("=======direction=" + direction)
        this.brotherNode.emit(settingBasic.gameEvent.brotherActionEvent, order)
    }

    playerStop(event) {
        if (this.currRole != this.RoleType.leadingRole) return

        let playerPos = cc.v2(0, 0);
        let touchPos = this.node.convertToNodeSpaceAR(event.touch.getLocation());
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

    thouchStart(event) {
        if (this.currRole == this.RoleType.leadingRole) return

        let touchPos = event.touch.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos)
        this.boxShadow = cc.instantiate(this.boxShadowPerfab)
        touchPos = this.node.convertToNodeSpaceAR(touchPos);
        this.boxShadow.setPosition(touchPos);
        this.boxShadow.parent = this.node;


    }
    thouchMove(event) {
        if (this.currRole == this.RoleType.leadingRole) return

        if (!this.boxShadow) return;
        let touchPos = event.touch.getLocation();
        this.camera.getCameraToWorldPoint(touchPos, touchPos)
        touchPos = this.node.convertToNodeSpaceAR(touchPos);
        this.boxShadow.setPosition(touchPos);

        //boxShadow到边缘时移动镜头
        let cameraSize = this.node.getContentSize();
        //向左移动
        if (this.boxShadow.x - this.boxShadow.width / 2 <= this.cameraNode.x - cameraSize.width / 2) {
            this.cameraMoveDirection = "L"
        } else if (this.boxShadow.x + this.boxShadow.width / 2 >= this.cameraNode.x + cameraSize.width / 2) {
            //向右移动
            this.cameraMoveDirection = "R"
        } else {
            this.cameraMoveDirection = "S"
        }

    }
    thouchEnd(event) {
        if (this.currRole == this.RoleType.leadingRole) return

        if (!this.boxShadow) return;
        this.boxShadow.emit(settingBasic.gameEvent.instanceBoxEvent, "");
        this.boxShadow = null;

    }



}

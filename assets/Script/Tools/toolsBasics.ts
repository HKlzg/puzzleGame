
import AudioControllor from "../Common/Audio/audioControllor"
//---------------------公共方法---------------------
export const toolsBasics = {
    /**
     * 获取音频管理对象
     */
    getAudioManager: function (): AudioControllor {
        return AudioControllor.getAudioManager();
    },

    /** 产生绳子
     * 预制资源 和 两端节点必须包含 RevoluteJoint 组件
     * @param {预制资源} ropePerfabs 
     * @param {绳子的连接点 数组类型} nodeArray 
     * @param {是否与转折点连接} isConnect 
     * @param {绳子名称/可选} ropeName
     * @param {绳子分组/可选} groupIndex
     * @returns {绳子的父节点}
     */
    creatRope: function (ropePerfabs: cc.Prefab, ropeGravity: number, nodeArray: Array<cc.Node>, isConnect: boolean, ropeName?: string, groupIndex?: number) {

        let len = nodeArray.length;
        let width = cc.instantiate(ropePerfabs).width;
        let distance = 0;
        let nodeNum = 0;

        let newRope = null;
        let newRopeBody = null;
        let revoJoint = null;
        //转折点
        let nextVector = null; //到下一个点的向量
        let lastNode = null;
        let nextNode = null;
        let lastRope = null;
        let nextRopePos = null;
        //作为产生的绳子的父节点
        let newJoint = new cc.Node("ropeNode");

        for (let n = 0; n < nodeArray.length; n++) {
            lastNode = nodeArray[n];
            nextNode = nodeArray[n + 1];
            if (n + 1 == len) break;

            /**转换为世界坐标 再计算两坐标之间的直线距离 sub()向量减法 mag() 计算向量的长度*/
            nextVector = nextNode.convertToWorldSpace(cc.v2(0, 0))
                .sub(lastNode.convertToWorldSpace(cc.v2(0, 0)));
            distance = Math.abs(nextVector.mag());

            nodeNum = Math.floor(distance / width);

            // lastRope = isConnect ? lastNode : (lastRope ? lastRope : lastNode);
            lastRope = lastRope ? lastRope : lastNode;
            for (let i = 0; i < nodeNum; i++) {
                newRope = cc.instantiate(ropePerfabs);
                ropeName ? newRope.name = ropeName : null;
                newRope.groupIndex = groupIndex ? groupIndex : 1;
                newRopeBody = newRope.getComponent(cc.RigidBody);
                newRopeBody.gravityScale = ropeGravity ? ropeGravity : 1;
                //mul() 缩放向量
                nextRopePos = lastRope.position.add((nextVector.mul(1 / nodeNum)));

                newRope.setPosition(nextRopePos);
                revoJoint = newRope.getComponent(cc.RevoluteJoint);
                revoJoint.connectedBody = lastRope.getComponent(cc.RigidBody);

                revoJoint.anchor.x = -width / 2;
                revoJoint.anchor.y = 0;
                revoJoint.connectedAnchor.x = width / 2;
                revoJoint.connectedAnchor.y = 0;

                lastRope = newRope;

                if (isConnect || n == len - 2) {
                    //当前绳子的最后节点挂在转折点上
                    nextNode.getComponent(cc.RevoluteJoint).connectedBody = i == nodeNum - 1 ?
                        newRope.getComponent(cc.RigidBody) : null;
                }

                newJoint.addChild(newRope);
            }
        }

        return newJoint;
    },

    /**
     * 用来确定滚动的两个图片的初始位置,第一张默认的X初始位置是 0 ;
     * 利用前一张图片的边框大小设置下一张图片的位置
     * [只适合向左移动]
     * @param bg1 
     * @param bg2 
     */
    photoSetPos: function (bg1, bg2) {
        bg1.x = 0;
        //利用前一张图片的边框大小设置下一张图片的位置
        var bg1BoundingBox = bg1.getBoundingBox();
        bg2.setPosition({ x: bg1BoundingBox.xMax - 1, y: bg1.y });
    },

    /**
     * 滚动效果
     * @param bgList 
     * @param speed 
     */
    photoScroll: function (bgList, speed) {
        for (var index = 0; index < bgList.length; index++) {
            var element = bgList[index];
            element.x -= speed;
        }
        var first_xMax = bgList[0].getBoundingBox().xMax;
        if (first_xMax <= 0) {
            var preFirstBg = bgList.shift();
            bgList.push(preFirstBg);
            var curFirstBg = bgList[0];
            preFirstBg.x = curFirstBg.getBoundingBox().xMax - 1;
        }

    },

    /**
     * 已知向量求角度
     * @param dirVec 
     */
    vectorsToDegress: function (dirVec: cc.Vec2) {
        let comVec = cc.v2(100, 0);    // 水平向右的对比向量
        let radian = dirVec.signAngle(comVec);    // 求方向向量与对比向量间的弧度
        let degree = cc.misc.radiansToDegrees(radian);    // 将弧度转换为角度

        return degree;
    },
    /**
     * 已知角度求向量
     * @param degree 
     */
    degreesToVectors: function (degree) {
        let radian = cc.misc.degreesToRadians(degree);    // 将角度转换为弧度
        let comVec = cc.v2(1, 0);    // 一个水平向右的对比向量
        let dirVec = comVec.rotate(-radian);    // 将对比向量旋转给定的弧度返回一个新的向量
        return dirVec;
    },

    /**
     * 求两点之间的距离
     * @param start 
     * @param end 
     */
    distanceVector: function (start, end) {
        let distance = start.sub(end).mag();
        return distance;
    },

    /**
     * 根据点击的坐标 计算出 箱子 在指定半径的圆上显示 的位置 ,用于限定箱子的范围
     * @param centerPos 世界坐标 圆心
     * @param boxPos 世界坐标 点击的坐标
     * @param rDis 圆的半径
     * @param grap 
     * @param targetNode 箱子的父节点
     */
    calcBoxPosFromCircle(centerPos: cc.Vec2, touchPos: cc.Vec2, rDis: number, grap: cc.Graphics, targetNode: cc.Node): cc.Vec2 {
        //转换为 世界坐标计算
        let vector = cc.Vec2.ZERO;
        let dis = toolsBasics.distanceVector(centerPos, touchPos);

        if (dis >= rDis) {
            let angle = touchPos.sub(centerPos).angle(cc.v2(rDis, 0));
            vector.x = centerPos.x + rDis * Math.cos(angle);
            vector.y = centerPos.y <= touchPos.y ?
                centerPos.y + rDis * Math.sin(angle) :
                centerPos.y - rDis * Math.sin(angle);
        } else {
            vector = touchPos;
        }

        grap.clear();
        grap.moveTo(centerPos.x, centerPos.y);
        grap.lineTo(vector.x, vector.y);

        grap.stroke();
        return targetNode.convertToNodeSpaceAR(vector);
    },


};
//导出 
export default toolsBasics;

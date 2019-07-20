
//---------------------公共方法---------------------
var toolsBasics = {
    /**lzg 計算角度 末位置,初始位置*/
    getVectorRadians: function (x1, y1, x2, y2) {
        // cc.log("getVectorRadians-----------------")
        let len_y = y2 - y1;
        let len_x = x2 - x1;

        let tan_yx = Math.abs(len_y) / Math.abs(len_x);
        let angle = 0;
        if (len_y > 0 && len_x < 0) {
            angle = Math.atan(tan_yx) * 180 / Math.PI - 90;
        } else if (len_y > 0 && len_x > 0) {
            angle = 90 - Math.atan(tan_yx) * 180 / Math.PI;
        } else if (len_y < 0 && len_x < 0) {
            angle = -Math.atan(tan_yx) * 180 / Math.PI - 90;
        } else if (len_y < 0 && len_x > 0) {
            angle = Math.atan(tan_yx) * 180 / Math.PI + 90;
        }
        return angle;
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


    createCable: function (ropePerfabs: cc.Prefab, ropeGravity: number, nodeArray: Array<cc.Node>, isConnect: boolean, ropeName?: string, groupIndex?: number) {

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
                revoJoint = newRope.getComponent(cc.WeldJoint);
                revoJoint.connectedBody = lastRope.getComponent(cc.RigidBody);

                revoJoint.anchor.x = (-width / 2);
                revoJoint.anchor.y = 0;
                revoJoint.connectedAnchor.x = (width / 2);
                revoJoint.connectedAnchor.y = 0;

                lastRope = newRope;

                if (isConnect || n == len - 2) {
                    //当前绳子的最后节点挂在转折点上
                    nextNode.getComponent(cc.WeldJoint).connectedBody = i == nodeNum - 1 ?
                        newRope.getComponent(cc.RigidBody) : null;
                }

                newJoint.addChild(newRope);
            }
        }

        return newJoint;
    },

    //用来确定滚动的两个图片的初始位置    
    photoSetPos: function (bg1, bg2) {
        bg1.x = 0;
        //利用前一张图片的边框大小设置下一张图片的位置
        var bg1BoundingBox = bg1.getBoundingBox();
        bg2.setPosition({ x: bg1BoundingBox.xMax - 1, y: bg1.y });
    },

    //滚动效果
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


};
//导出 
export default toolsBasics;

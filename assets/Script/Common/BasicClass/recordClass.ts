
class achievement { //每个成就的详细信息
    type: number;
    name: string;
    desc: string;
    isGet: boolean;
    count: number;
    needNum: number;
    constructor({ type, name, desc, isGet, count, needNum }) {
        this.type = type;
        this.name = name;
        this.desc = desc;
        this.isGet = isGet;
        this.count = count;
        this.needNum = needNum;
    }
}
//游戏存档类
export class gameRecordClass {
    playerName: string = "test";
    totolTime: string = "";
    lastTime: string = "";
    //成就
    achievements: achievement[] = [];
    //道具
    items: any = [];
    //关卡记录 初始值
    // levelRecord = { lv1: true, lv2: false, lv3: false, lv4: false, lv5: false };
    levelRecord = { lv1: true, lv2: true, lv3: true, lv4: true, lv5: true }; //测试

}
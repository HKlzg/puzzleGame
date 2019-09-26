
const { ccclass, property } = cc._decorator;
import settingBasic from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";
import audioSetting from "../Audio/audioSetting";

@ccclass
export default class NewClass extends LogicBasicComponent {

    @property(Number)
    angle = 1;
    @property(Number)
    speed = 1;
    @property(cc.SpriteFrame)
    spriteWhite: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    spriteRed: cc.SpriteFrame = null;

    @property(cc.Boolean)
    isAudio = false;

    sprite: cc.Sprite = null;
    rdis: number = 0;
    audioManager: any = null;

    start() {
        this.node.on(settingBasic.gameEvent.changeCircleColor, this.changeColor, this);
        this.sprite = this.node.getComponent(cc.Sprite);
        this.rdis = this.node.width;
        if (this.isAudio) {
            this.audioManager = cc.find("UICamera/audio").getComponent("audioControllor");
            this.audioManager.playAudio(audioSetting.other.lv1.waterWheel, true)
        }
    }

    logicUpdate(dt) {
        if (this.angle == 1)
            this.node.angle += this.speed;
        else
            this.node.angle -= this.speed;
    }

    changeColor(color: string) {
        switch (color) {
            case "red":
                this.sprite.spriteFrame = this.spriteRed
                break;
            case "white":
                this.sprite.spriteFrame = this.spriteWhite
                break;
            default:
                break;
        }
        this.node.width = this.rdis;
        this.node.height = this.rdis;
    }


}

import setting from "../../Setting/settingBasic";
import { LogicBasicComponent } from "../LogicBasic/LogicBasicComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends LogicBasicComponent {
    @property(cc.SpriteFrame)
    boxShadow: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    boxShadowRed: cc.SpriteFrame = null;

    @property(cc.Prefab)
    boxInstancePerfab: cc.Prefab = null;

    isOK: boolean = true; //是否能实例化
    sprite: cc.Sprite = null;

    body: cc.RigidBody = null;
    clider: cc.BoxCollider = null;
    isContact: boolean = false;
    boxParent: cc.Node = null;
    start() {
        this.body = this.node.getComponent(cc.RigidBody);
        this.clider = this.node.getComponent(cc.BoxCollider);
        this.sprite = this.node.getComponent(cc.Sprite);
        this.clider.enabled = true;
    }

    onCollisionEnter(other, self) {
        if (other.name.substr(0, 5) != "sqera")
            this.isContact = true
    }
    onCollisionStay(other, self) {
        if (other.name.substr(0, 5) != "sqera")
            this.isContact = true
    }
    onCollisionExit(other, self) {
        this.isContact = false
    }

    logicUpdate() {
        if (this.isContact) {
            this.isOK = false
            this.sprite.spriteFrame != this.boxShadowRed ?
                this.sprite.spriteFrame = this.boxShadowRed : null;
        } else {
            this.isOK = true;
            this.sprite.spriteFrame != this.boxShadow ?
                this.sprite.spriteFrame = this.boxShadow : null;

        }
    }

}

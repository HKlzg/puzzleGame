import setting from "../../Setting/settingBasic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.SpriteFrame)
    boxShadow: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    boxShadowRed: cc.SpriteFrame = null;

    @property(cc.Prefab)
    boxInstancePerfab: cc.Prefab = null;

    isOK: boolean = true; //是否能实例化
    sprite: cc.Sprite = null;
    isShadow: boolean = true; //是否为虚影状态

    body: cc.RigidBody = null;
    clider: cc.PhysicsBoxCollider = null;
    start() {
        this.node.on(setting.gameEvent.instanceBoxEvent, this.changePic, this);
        this.body = this.node.getComponent(cc.RigidBody);
        this.clider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.sprite = this.node.getComponent(cc.Sprite);

    }

    onBeginContact(contact, self, other) {
        if (this.isShadow && this.isOK) {
            this.isOK = false
            this.sprite.spriteFrame = this.boxShadowRed;
        }
    }

    onEndContact(contact, self, other) {
        if (this.isShadow && !this.isOK) {
            this.isOK = true;
            this.sprite.spriteFrame = this.boxShadow;
        }
    }

  
    changePic(msg) {
        if (this.isShadow && this.isOK) {
            this.isShadow = false;

            let box = cc.instantiate(this.boxInstancePerfab)
            this.node.parent.addChild(box);
            box.setPosition(this.node.position);

        } else {
        }

        this.node.removeFromParent();
    }


}

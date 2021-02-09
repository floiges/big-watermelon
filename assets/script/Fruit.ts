// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass} = cc._decorator;

@ccclass
export default class Fruit extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    id: number = 0;

    init(id: number, iconSF: cc.SpriteFrame) {
        this.id = id;
        // 根据传入的参数修改贴图资源
        const sp = this.node.getComponent(cc.Sprite);
        sp.spriteFrame = iconSF;
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact (contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (self instanceof cc.PhysicsCircleCollider && other instanceof cc.PhysicsCircleCollider) {
            const s = self.node.getComponent('Fruit');
            const o = other.node.getComponent('Fruit');
            if (s && o && s.id === o.id) {
                const event = new cc.Event.EventCustom('onFruitCompose', true);
                event.detail = {
                    id: s.id,
                    self: s.node,
                    other: o.node,
                };
                self.node.dispatchEvent(event);
            }
        }

    }

    onEndContact (contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (self instanceof cc.PhysicsCircleCollider && other instanceof cc.PhysicsCircleCollider) {
            console.log("🚀 ~ file: Fruit.ts ~ line 50 ~ Fruit ~ onEndContact ~ self", self.node.position)
        }
    }
}

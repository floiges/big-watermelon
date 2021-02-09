// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import JuiceItem from "./JuiceItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Juice extends cc.Component {

    @property(cc.SpriteFrame)
    particle: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    circle: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    slash: cc.SpriteFrame = null;

    init (data: JuiceItem) {
        // this.node.getComponent(cc.Sprite).spriteFrame = null;
        const { particle, circle, slash } = data;
        this.particle = particle;
        this.circle = circle;
        this.slash = slash;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    // 粒子动画的主要的实现思路为：初始化N个粒子，控制他们的速度大小、方向和生命周期，然后控制每个粒子按照对应的参数执行动画，所有粒子汇集在一起的效果就组成了粒子动画。
    showJuice (pos: cc.Vec2, width: number) {
        // 果粒
        for (let i = 0; i < 10; i++) {
            const node = new cc.Node('Sprite');
            const sp = node.addComponent(cc.Sprite);

            sp.spriteFrame = this.particle;
            node.parent = this.node;

            const a = 359 * Math.random(),
                i = 30 * Math.random() + width / 2,
                l = cc.v2(Math.sin(a * Math.PI / 180) * i, Math.cos(a * Math.PI / 180) * i);
            node.scale = 0.5 * Math.random() + width / 100;
            const p = .5 * Math.random();

            node.setPosition(pos);
            node.runAction(
                cc.sequence(
                    cc.spawn(
                        cc.moveBy(p, l),
                        cc.scaleTo(p + 0.5, .3),
                        cc.rotateBy(p + 0.5, RandomInteger(-360, 360))
                    ),
                    cc.fadeOut(.1),
                    cc.callFunc(() => {
                        node.active = false;
                    }, this))
            );
        }

        // 水珠
        for (let f = 0; f < 20; f++) {
            const node = new cc.Node('Sprite');
            const sp = node.addComponent(cc.Sprite);

            sp.spriteFrame = this.circle;
            node.parent = this.node;

            let a = 359 * Math.random(), i = 30 * Math.random() + width / 2,
                l = cc.v2(Math.sin(a * Math.PI / 180) * i, Math.cos(a * Math.PI / 180) * i);
            node.scale = .5 * Math.random() + width / 100;
            let p = .5 * Math.random();
            node.setPosition(pos);
            node.runAction(cc.sequence(
                cc.spawn(
                    cc.moveBy(p, l),
                    cc.scaleTo(p + .5, .3)
                ),
                cc.fadeOut(.1),
                cc.callFunc(function () {
                    node.active = false
                }, this))
            );
        }

        // 果汁
        const node = new cc.Node('Sprite');
        const sp = node.addComponent(cc.Sprite);

        sp.spriteFrame = this.slash;
        node.parent = this.node;

        node.setPosition(pos);
        node.scale = 0
        node.angle = RandomInteger(0, 360)
        node.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(.2, width / 150),
                cc.fadeOut(1)
            ),
            cc.callFunc(function () {
                node.active = false
            }, this))
        );
    }
}

const RandomInteger = function (e: number, t: number) {
    return Math.floor(Math.random() * (t - e) + e);
}
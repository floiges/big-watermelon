// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

// Can not serialize 'xxx' because the specified type is anonymous, please provide a class name
// @ccclass 可以指定名称
@ccclass('JuiceItem')
export default class JuiceItem {

    @property(cc.SpriteFrame)
    particle: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    circle: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    slash: cc.SpriteFrame = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}

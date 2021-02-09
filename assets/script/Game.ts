// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Juice from "./Juice";
import JuiceItem from "./JuiceItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property([cc.SpriteFrame])
    fruits: cc.SpriteFrame[] = [];

    @property(cc.Prefab)
    fruitPrefab: cc.Prefab = null;

    @property([JuiceItem])
    juices: JuiceItem[] = [];

    @property(cc.Prefab)
    juicePrefab: cc.Prefab = null;

    @property(cc.AudioClip)
    boomAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    waterAudio: cc.AudioClip = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    isCreating: boolean = false;
    fruitCount: number = 0;
    score: number = 0;
    currentFruit: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initPhysics();
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on('onFruitCompose', this.onFruitCompose, this);
        this.initOneFruit();
    }

    start () {

    }

    // update (dt) {}

    onDestroy () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off('onFruitCompose', this.onFruitCompose, this);
    }

    /**
     * 开启无力引擎和碰撞检测
     */
    initPhysics () {
        // 物理引擎
        const instance = cc.director.getPhysicsManager();
        instance.enabled = true;
        instance.gravity = cc.v2(0, -960);

        // 碰撞检测
        const collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;

        // 设置四周碰撞区域
        const width = this.node.width;
        const height = this.node.height;

        const node = new cc.Node();
        node.width = width;
        node.height = height;
        const body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        const _addBound = (node: cc.Node, x: number, y: number, width: number, height: number) => {
            const collider = node.addComponent(cc.PhysicsBoxCollider);
            collider.offset.x = x;
            collider.offset.y = y;
            collider.size.width = width;
            collider.size.height = height;
        };

        _addBound(node, 0, -height / 2, width, 1);
        _addBound(node, 0, height / 2, width, 1);
        _addBound(node, -width / 2, 0, 1, height);
        _addBound(node, width / 2, 0, 1, height);

        node.parent = this.node;
    }

    initOneFruit(id = 0) {
        this.fruitCount++;
        this.currentFruit = this.createOneFruitOnPos(0, 400, id);
    }

    createOneFruit (id: number): cc.Node {
        const fruit = cc.instantiate(this.fruitPrefab);
        const sp = this.fruits[id];

        // 获取到节点的 Fruit组件
        // id 从 0 开始, fruit 编号从 1 开始
        fruit.getComponent('Fruit').init(id + 1, sp);
        fruit.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        fruit.getComponent(cc.PhysicsCircleCollider).radius = 0;
        this.node.addChild(fruit);
        fruit.scale = 0.6;

        return fruit;
    }

    createOneFruitOnPos(x: number, y: number, id: number) {
        const fruit = this.createOneFruit(id);
        fruit.setPosition(cc.v2(x, y));
        return fruit;
    }

    createFruitJuice(id: number, pos: cc.Vec2, width: number) {
        // 显示动画
        const juice = cc.instantiate(this.juicePrefab);
        this.node.addChild(juice);

        const juiceItem = this.juices[id];
        const instance: Juice = juice.getComponent('Juice');
        instance.init(juiceItem);
        instance.showJuice(pos, width);
    }

    startFruitPhysics (fruit: cc.Node) {
        fruit.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        const physicsCircleCollider = fruit.getComponent(cc.PhysicsCircleCollider);
        physicsCircleCollider.radius = fruit.height / 2;
        physicsCircleCollider.apply();
    }

    getNextFruitId () {
        if (this.fruitCount < 3) {
            return 0;
        }
        if (this.fruitCount === 3) {
            return 1;
        }

        return Math.floor(Math.random() * 4) + 1;
    }

    updateScore (fruitId: number) {
        this.score += fruitId * 2;
        this.scoreLabel.string = `${this.score}`;
    }

    onTouchStart (event: cc.Event.EventTouch) {
        if (this.isCreating) {
            return;
        }

        this.isCreating = true;
        const { width, height } = this.node;

        const fruit = this.currentFruit;

        const pos = event.getLocation();
        let { x, y } = pos;
        x = x - width / 2;
        y = y - height / 2;

        const action = cc.sequence(cc.moveBy(0.3, cc.v2(x, 0)).easing(cc.easeCubicActionIn()), cc.callFunc(() => {
            // 开启物理效果
            this.startFruitPhysics(fruit);

            // 1s 后重新生成一个
            this.scheduleOnce(() => {
                const nextId = this.getNextFruitId();
                this.initOneFruit(nextId);
                this.isCreating = false;
            }, 1);

        }));
        fruit.runAction(action);
    }

    // 两个水果碰撞
    onFruitCompose (event: cc.Event.EventCustom) {
        cc.audioEngine.play(this.boomAudio, false, 1);
        cc.audioEngine.play(this.waterAudio, false, 1);
        const { id, self, other } = event.detail;

        self.removeFromParent(true);
        other.removeFromParent(true);

        const { x, y } = other;
        this.createFruitJuice(id, cc.v2(x, y), other.width);
        this.updateScore(id);

        const nextId = id + 1;
        if (nextId <= 10) {
            const newFruit = this.createOneFruitOnPos(x, y, nextId);
            this.startFruitPhysics(newFruit);

            // 显示动画效果
            newFruit.scale = 0;
            cc.tween(newFruit).to(.5, {
                scale: 0.6
            }, {
                easing: 'backOut',
            }).start();
        } else {
            // 合成两个西瓜
        }
    }
}

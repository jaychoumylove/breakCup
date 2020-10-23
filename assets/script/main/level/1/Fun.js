cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        this.initFun();
    },

    initFun() {
        const dft = {
            position: cc.v2(this.node.x, this.node.y),
            scale: this.node.scale,
            opacity: this.node.opacity
        }, act = {
            position: cc.v2(63, 160),
            scale: 2,
            opacity: 60
        };
        let up = cc.tween().to(1, act),
            down = cc.tween().to(1, dft),
            action = cc.tween().then(up).then(down);
        cc.tween(this.node).repeatForever(action).start();
    }
});

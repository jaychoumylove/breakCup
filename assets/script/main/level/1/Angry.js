cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        this.initAngry();
    },

    initAngry() {
        const dft = {
            scale: this.node.scale,
        }, act = {
            scale: 1.5,
        };
        let up = cc.tween().to(0.6, act),
            down = cc.tween().to(0.6, dft),
            action = cc.tween().then(up).then(down);
        cc.tween(this.node).repeatForever(action).start();
    }
});

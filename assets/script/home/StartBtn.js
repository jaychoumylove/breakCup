cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        this.node.on('click', this.startGame, this);
        this.initAction();
    },

    initAction() {
        const dft = {
            scale: this.node.scale,
        }, act = {
            scale: 0.8,
        };
        let up = cc.tween().to(0.6, act),
            down = cc.tween().to(0.6, dft),
            action = cc.tween().then(up).then(down);
        cc.tween(this.node).repeatForever(action).start();
    },

    startGame() {
        const evt = new cc.Event.EventCustom('_toggle_loading', true);
        evt.setUserData({status: true});
        this.node.dispatchEvent(evt);
        cc.director.loadScene('level');
    }
});

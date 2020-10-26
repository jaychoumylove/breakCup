cc.Class({
    extends: cc.Component,

    properties: {
        doubelNode: cc.Node,
        singleNode: cc.Node,
    },

    onLoad () {
        this.doubelNode.on('click', this.pressDoubel, this);
        this.singleNode.on('click', this.pressSingle, this);
        this.node.on('_got', this.dispatchGot, this);
    },

    onDestroy() {
        // this.doubelNode.getComponent(cc.Button).node.off('click', this.pressDoubel, this);
        // this.singleNode.getComponent(cc.Button).node.off('click', this.pressSingle, this);
        this.node.off('_got', this.dispatchGot, this);
    },

    // update (dt) {},

    dispatchGot() {
        this.doubelNode.active = true;
        this.initDoubelAction();
        setTimeout(() => {
            this.singleNode.active = true;
        }, 2000);
    },

    initDoubelAction() {
        const dft = {
            scale: this.doubelNode.scale,
        }, act = {
            scale: 1.2,
        };
        let up = cc.tween().to(1, act),
            down = cc.tween().to(1, dft),
            action = cc.tween().then(up).then(down);
        cc.tween(this.doubelNode).repeatForever(action).start();
    },

    pressDoubel(evt) {
        cc.log('pressDoubel');
        const dphevt = new cc.Event.EventCustom('_state_change', true);
        dphevt.setUserData({heart: 2});
        this.node.dispatchEvent(dphevt);
        this.goNext();
    },

    pressSingle(evt) {
        cc.log('pressSingle');
        this.goNext();
    },

    goNext() {
        this.node.dispatchEvent(new cc.Event.EventCustom('_check_three_star', true));
    },
});

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad () {
        this.node.on('click', this.goNextLevel, this);
    },

    // update (dt) {},

    goNextLevel() {
        cc.log('go next');
    },
});

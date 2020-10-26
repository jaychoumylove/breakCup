cc.Class({
    extends: cc.Component,

    properties: {
        showTargetNode: cc.Node,
        showContainerNode: cc.Node,
    },

    onLoad() {
        this.show = false;
        this.node.on('_add_heart', this.checkHeart, this);
    },

    onDestroy() {
        this.node.off('_add_heart', this.checkHeart, this);
    },

    checkHeart(evt) {
        if (this.showContainerNode.active) {
            return;
        }

        this.showContainerNode.active = true;
        this.showTargetNode.active = true;
        const dphEvt = new cc.Event.EventCustom('_dispatch_add_load', true);
        dphEvt.setUserData({node: this.showContainerNode});
        this.showTargetNode.dispatchEvent(dphEvt)
    },
});

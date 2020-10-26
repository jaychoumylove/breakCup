cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Node,
        getRewardBtn: cc.Node,

        containerNode: cc.Node,

        addType: cc.String,
        addNumber: cc.Integer,
    },

    onLoad() {
        this.getRewardBtn.on('click', this.handleGetReward, this);
        this.node.on('_dispatch_add_load', this.dispatchLoad, this);
    },

    handleGetReward(evt) {
        cc.log('press get reward');
        const dphevt = new cc.Event.EventCustom('_state_change', true);
        dphevt.setUserData({[this.addType]: this.addNumber});
        this.node.dispatchEvent(dphevt);
    },

    dispatchLoad (evt) {
        const { node } = evt.getUserData();
        this.containerNode = node;
        setTimeout(() => {
            this.closeBtn.active = true;
            this.closeBtn.on('click', this.handleClose, this);
        }, 2000);
    },

    handleClose(evt) {
        this.closeBtn.active = false;
        this.node.active = false;
        this.containerNode.active = false;
    },
});

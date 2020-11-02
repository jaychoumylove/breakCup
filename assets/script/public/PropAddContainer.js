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
        this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
        this.node.on('_dispatch_add_load', this.dispatchLoad, this);

        // 取消广告icon
        // this.getRewardBtn.getComponent(cc.Button).target.getChildByName('icon').active = false;
    },

    handleGetReward(evt) {
        this.AudioPlayer.playOnceMusic('button');
        cc.log('press get reward');
        const ad = cc.find("bgm").getComponent("WechatAdService");
        const call = () => {
            const dphevt = new cc.Event.EventCustom('_state_change', true);
            dphevt.setUserData({[this.addType]: this.addNumber});
            this.node.dispatchEvent(dphevt);
        }
        const res = ad.openVideoWithCb(() => { call() });
        if (false == res) {
            // 不在微信环境下直接获取奖励
            call();
        }
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
        this.AudioPlayer.playOnceMusic('button');
        this.closeBtn.active = false;
        this.node.active = false;
        this.containerNode.active = false;
    },
});

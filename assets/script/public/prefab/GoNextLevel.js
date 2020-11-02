cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad () {
        this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
        this.node.on('click', this.goNextLevel, this);
        // 取消去下一关
        // this.node.active = false;
    },

    // update (dt) {},

    goNextLevel() {
        this.AudioPlayer.playOnceMusic('button');
        cc.log('go next');
        const ad = cc.find("bgm").getComponent("WechatAdService");
        const call = () => {
            const evt1 = new cc.Event.EventCustom('_toggle_loading', true);
            evt1.setUserData({status: true});
            this.node.dispatchEvent(evt1);
            const evt = new cc.Event.EventCustom('_record_lv_star', true);
            evt.setUserData({star: 1});
            this.node.dispatchEvent(evt);
            this.node.dispatchEvent(new cc.Event.EventCustom('_unlock_lv', true));
            this.node.dispatchEvent(new cc.Event.EventCustom('_go_next_lv', true));
        
        }
        const res = ad.openVideoWithCb(() => { call() });
        if (false == res) {
            // 不在微信环境下直接获取奖励
            call();
        }
    },
});
cc.Class({
    extends: cc.Component,

    properties: {
        id: cc.Integer
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.tag > 0) {
            const evt = new cc.Event.EventCustom('_box_break', true);
            evt.setUserData({x: this.node.x, y: this.node.y, id: this.id});
            //获取全局播放器
            const AudioPlayer = cc.find("bgm").getComponent("AudioManager");
            //停止再开启背景音乐
            AudioPlayer.playOnceMusic('glassBreak');
            this.node.destroy();
            this.node.dispatchEvent(evt);
        }
    },
});

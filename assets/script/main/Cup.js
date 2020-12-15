cc.Class({
  extends: cc.Component,

  properties: {
    id: cc.Integer,
  },

  onBeginContact: function (contact, selfCollider, otherCollider) {
    if (otherCollider.tag > 0) {
      const evt = new cc.Event.EventCustom("_box_break", true);
      const pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
      evt.setUserData({
        pos: pos,
        _id: this.node._id,
        id: this.id,
      });
      //获取全局播放器
      const AudioPlayer = cc.find("bgm").getComponent("AudioManager");
      //停止再开启背景音乐
      AudioPlayer.playOnceMusic("glassBreak");
      this.node.destroy();
      this.node.dispatchEvent(evt);
    }
  },
});

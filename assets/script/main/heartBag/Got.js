cc.Class({
  extends: cc.Component,

  properties: {
    doubelNode: cc.Node,
    singleNode: cc.Node,
  },

  onLoad() {
    this.doubelNode.on("click", this.pressDoubel, this);
    this.singleNode.on("click", this.pressSingle, this);
    this.node.on("_got", this.dispatchGot, this);
    this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
  },

  onDestroy() {
    // this.doubelNode.getComponent(cc.Button).node.off('click', this.pressDoubel, this);
    // this.singleNode.getComponent(cc.Button).node.off('click', this.pressSingle, this);
    this.node.off("_got", this.dispatchGot, this);
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
      },
      act = {
        scale: 1.4,
      };
    let up = cc.tween().to(0.5, act),
      down = cc.tween().to(0.5, dft),
      action = cc.tween().then(up).then(down);
    cc.tween(this.doubelNode).repeatForever(action).start();
  },

  pressDoubel(evt) {
    this.AudioPlayer.playOnceMusic("button");
    cc.log("pressDoubel");
    const ad = cc.find("bgm").getComponent("WechatAdService");
    const call = () => {
      const dphevt = new cc.Event.EventCustom("_state_change", true);
      dphevt.setUserData({ heart: 2 });
      this.node.dispatchEvent(dphevt);
      this.goNext();
    };
    const res = ad.openVideoWithCb(() => {
      call();
    });
    if (false == res) {
      // 不在微信环境下直接获取奖励
      call();
    }
  },

  pressSingle(evt) {
    this.AudioPlayer.playOnceMusic("button");
    cc.log("pressSingle");
    const ad = cc.find("bgm").getComponent("WechatAdService");
    ad.setGBAd("banner", false);
    this.goNext();
  },

  goNext() {
    this.node.dispatchEvent(
      new cc.Event.EventCustom("_check_three_star", true)
    );
  },
});

cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.node.on("click", this.startGame, this);
    this.initAction();
    this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
  },

  initAction() {
    const dft = {
        scale: this.node.scale,
      },
      act = {
        scale: 0.8,
      };
    let up = cc.tween().to(0.6, act),
      down = cc.tween().to(0.6, dft),
      action = cc.tween().then(up).then(down);
    cc.tween(this.node).repeatForever(action).start();
  },

  startGame() {
    this.AudioPlayer.playOnceMusic("button");
    const evt = new cc.Event.EventCustom("_toggle_loading", true);
    evt.setUserData({ status: true });
    this.node.dispatchEvent(evt);
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      const ad = cc.find("bgm").getComponent("WechatAdService");
      ad.setGBAd("banner", false);
    }
    cc.director.loadScene("level");
  },
});

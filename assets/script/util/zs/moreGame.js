cc.Class({
  extends: cc.Component,

  properties: {
    moreGame: cc.Prefab,
  },

  onLoad() {
    this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
    this.node.on("click", this.handleRedirect, this);
  },

  handleRedirect() {
    this.AudioPlayer.playOnceMusic("button");
    if (!cc.find("Canvas/openOneVertical")) {
      const ad = cc.find("bgm").getComponent("WechatAdService");
      ad.setGBAd("banner", false);
      cc.find("Canvas").addChild(cc.instantiate(this.moreGame));
    }
  },
});

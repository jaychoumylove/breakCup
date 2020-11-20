cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this._cuurentScene = cc.director.getScene().name;

    if (typeof wx == "undefined") {
      cc.warn("wx is undefined!");
    } else {
      // 初始化广告单例
      // 激励视频
      this.ad = cc.find("bgm").getComponent("WechatAdService");
      setTimeout(() => {
        this.ad.initAD();
      }, 1);
    }
  },

  update() {
    const currentScene = cc.director.getScene().name;
    if (this._cuurentScene != currentScene) {
      this.ad.setGBAd("grid", false);
      this.ad.setGBAd("banner", false);
      this._cuurentScene = currentScene;
    }
  },
});

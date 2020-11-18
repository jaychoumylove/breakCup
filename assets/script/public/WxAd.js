const { initAD, setGBAd } = require("../util/wechatAd");

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
      setTimeout(() => {
        initAD();
      }, 1);
    }
  },

  update() {
    const currentScene = cc.director.getScene().name;
    if (this._cuurentScene != currentScene) {
      setGBAd("grid", false);
      setGBAd("banner", false);
      this._cuurentScene = currentScene;
    }
  },
});

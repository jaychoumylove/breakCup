cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    cc.game.addPersistRootNode(this.node);
    this._currentScene = cc.director.getScene().name;
    this._lastScene = null;
  },

  update() {
    const currentScene = cc.director.getScene().name;
    if (this._currentScene != currentScene) {
      this._lastScene = this._currentScene;
      this._currentScene = currentScene;
      if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        const ad = this.node.getComponent("WechatAdService");
        ad.setGBAd("banner", false);
        ad.setGBAd("grid", false);
      }
    }
  },

  getLastScene() {
    return this._lastScene;
  },
});

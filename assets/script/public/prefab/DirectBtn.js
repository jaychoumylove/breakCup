cc.Class({
  extends: cc.Component,

  properties: {
    scene: cc.String,
    // openOne: cc.Prefab,
  },

  onLoad() {
    this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
    this.node.on("click", this.handleRedirect, this);
    if (this.scene == "store") {
      this.node.active = false;
    }
    // cc.resources.load("prefab/openOneVertical", cc.Prefab, (err, prefab) => {
    //   if (!err) {
    //     this.openOne = prefab;
    //     cc.log(this.openOne);
    //   }
    // });
  },

  handleRedirect() {
    this.AudioPlayer.playOnceMusic("button");

    const ad = cc.find("bgm").getComponent("WechatAdService");
    ad.setGBAd("banner", false);
    if (this.scene != "store") {
      if (this.scene == "home") {
        cc.resources.load(
          "prefab/openOneVertical",
          cc.Prefab,
          (err, prefab) => {
            cc.log(err, prefab);
            if (!err) {
              const openNode = cc.instantiate(prefab);
              openNode.getComponent("OpenOneFullAd").isback = true;
              cc.find("Canvas").addChild(openNode);
            }
          }
        );
      }
      const evt = new cc.Event.EventCustom("_toggle_loading", true);
      evt.setUserData({ status: true });
      this.node.dispatchEvent(evt);
      return;
    }
    if (this.scene) {
      const evt = new cc.Event.EventCustom("_toggle_loading", true);
      evt.setUserData({ status: true });
      this.node.dispatchEvent(evt);
      cc.director.loadScene(this.scene);
    }
  },
});

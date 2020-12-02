import { versionCheck } from "../../util/ZSLoad";

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
    if (this.scene == "store") {
      return;
    }
    this.AudioPlayer.playOnceMusic("button");
    let scene = this.scene;
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      const ad = cc.find("bgm").getComponent("WechatAdService");
      ad.setGBAd("banner", false);
      if (scene == "home") {
        if (versionCheck()) {
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
          const evt = new cc.Event.EventCustom("_toggle_loading", true);
          evt.setUserData({ status: true });
          this.node.dispatchEvent(evt);
          return;
        }
      }
    }
    if (scene == "back") {
      scene = cc.find("bgm").getComponent("RootNode").getLastScene();
    }
    const evt = new cc.Event.EventCustom("_toggle_loading", true);
    evt.setUserData({ status: true });
    this.node.dispatchEvent(evt);
    cc.director.loadScene(scene);
    return;
  },
});

import { versionCheck } from "../ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    if (versionCheck()) {
      if (cc.sys.platform == cc.sys.OPPO_GAME) {
        cc.resources.load("prefab/nativeAd", cc.Prefab, (err, prefab) => {
          if (!err) {
            const node = cc.instantiate(prefab);
            cc.find("Canvas").addChild(node);
            console.log("addedprefab/nativeAd");
          }
        });
      }
    }
  },
});

import { versionCheck } from "../ZSLoad";
cc.Class({
  extends: cc.Component,

  properties: {
    freeSideAd: cc.Prefab,
  },

  onLoad() {
    if (versionCheck()) {
      // 不在审核中
      const freeSideAdNode = cc.instantiate(this.freeSideAd);
      cc.find("Canvas/Main Camera").addChild(freeSideAdNode);
    }
  },
});

import { isOppo } from "../common";
import { versionCheck, getCfgVal, getOpenStatus } from "../ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    if (
      isOppo() &&
      versionCheck() &&
      !getOpenStatus() &&
      parseInt(getCfgVal("zs_jump_switch"))
    ) {
      cc.resources.load("prefab/nativeAd", cc.Prefab, (err, prefab) => {
        if (!err) {
          const node = cc.instantiate(prefab);
          cc.find("Canvas").addChild(node);
          console.log("addedprefab/nativeAd");
        }
      });
    }
  },
});

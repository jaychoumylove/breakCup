import { isWechat } from "../common";
import { versionCheck } from "../ZSLoad";
cc.Class({
  extends: cc.Component,

  properties: {
    freeSideAd: cc.Prefab,

    parent: "canvas",

    pos: cc.Vec2,
  },

  onLoad() {
    if (isWechat()) {
      if (versionCheck()) {
        // 不在审核中
        const freeSideAdNode = cc.instantiate(this.freeSideAd);
        let parent;
        if (this.parent == "canvas") {
          parent = cc.find("Canvas/Main Camera");
        }
        if (this.parent == "self") {
          parent = this.node;
        }
        freeSideAdNode.x = this.pos.x;
        freeSideAdNode.y = this.pos.y;
        parent.addChild(freeSideAdNode);
      }
    }
  },
});

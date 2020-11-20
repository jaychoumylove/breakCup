import { initAD } from "../util/wechatAd";
import { zsLoad } from "../util/ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    zsLoad();
    cc.director.preloadScene(
      "home",
      (complete, total) => {},
      (error) => {
        cc.director.loadScene("home");
      }
    );
  },
});

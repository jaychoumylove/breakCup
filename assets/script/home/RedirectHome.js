import { initAD } from "../util/wechatAd";
import { zsLoad, initZsData } from "../util/ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    zsLoad();
    initZsData();
    cc.director.preloadScene(
      "home",
      (complete, total) => {},
      (error) => {
        cc.director.loadScene("home");
      }
    );
  },
});

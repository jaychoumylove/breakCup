import { zsLoad, initZsData } from "../util/ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.loadedCfg = false;
    this.preloadHome = false;
    this.loadedData = false;
    zsLoad(() => {
      this.loadedCfg = true;
      this.checkRedirectState();
    });
    initZsData(() => {
      this.loadedData = true;
      this.checkRedirectState();
    });
    cc.director.preloadScene(
      "home",
      (complete, total) => {},
      (error) => {
        this.preloadHome = true;
        this.checkRedirectState();
      }
    );
  },

  checkRedirectState() {
    if (this.loadedCfg && this.loadedData && this.preloadHome) {
      cc.director.loadScene("home");
    }
  },
});

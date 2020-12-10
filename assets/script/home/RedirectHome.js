import { zsLoad, initZsData } from "../util/ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.loadedCfg = false;
    this.preloadHome = false;
    this.loadedData = false;
    console.log("redirectload");
    zsLoad(() => {
      this.loadedCfg = true;
      console.log("this.loadedCfg", this.loadedCfg);
      this.checkRedirectState();
    });
    initZsData(() => {
      this.loadedData = true;
      console.log("this.loadedData", this.loadedData);
      this.checkRedirectState();
    });
    cc.director.preloadScene(
      "home",
      (complete, total) => {},
      (error) => {
        this.preloadHome = true;
        console.log("this.preloadHome", this.preloadHome);
        this.checkRedirectState();
      }
    );
  },

  checkRedirectState() {
    console.log("this.preloadHome", this.preloadHome);
    console.log("this.loadedData", this.loadedData);
    console.log("this.loadedCfg", this.loadedCfg);
    if (this.loadedCfg && this.loadedData && this.preloadHome) {
      cc.director.loadScene("home");
    }
  },
});

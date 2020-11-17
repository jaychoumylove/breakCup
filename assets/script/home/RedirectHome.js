cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    cc.director.preloadScene(
      "home",
      (complete, total) => {},
      (error) => {
        cc.director.loadScene("home");
      }
    );
  },
});

cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    if (cc.sys.platform == cc.sys.OPPO_GAME) {
      console.log("addnavtive");
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

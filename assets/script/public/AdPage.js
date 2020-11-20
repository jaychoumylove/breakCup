import { getZsLoadData } from "../util/ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    itemPrefab: cc.Prefab,
    adParent: cc.Node,
  },

  start() {
    getZsLoadData((res) => {
      this.showAd(res);
    });
  },

  showAd(adData) {
    let adArray = adData.promotion;

    if (adArray.length > 0) {
      for (let i = 0; i < adArray.length; i++) {
        const adEntity = adArray[i];
        let adNode = cc.instantiate(this.itemPrefab);
        this.adParent.addChild(adNode);
        let adItem = adNode.getComponent("AdItem");
        if (adItem) {
          adItem.init(adEntity);
        }
      }
    }
  },

  // update (dt) {},
});

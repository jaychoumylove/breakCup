import { isOppo } from "../common";
import zsLoad from "./ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    adNodes: [cc.Node],
    itemPrefab: cc.Prefab,
    currentAd: 0,
    adArray: [],
    refreshAd: {
      default: 4,
      type: cc.Integer,
    },

    intervalRes: "",
  },

  onLoad() {
    if (
      isOppo() &&
      zsLoad.versionCheck() &&
      parseInt(zsLoad.getCfgVal("zs_jump_switch"))
    ) {
      // 导出开关为1才加
      this.refreshAds();
    }
  },

  onDestroy() {
    this.cleanintervalRefresh();
  },

  refreshAds() {
    zsLoad.getZsLoadData((res) => {
      this.showAd(res);
    });
  },

  showAd(adData) {
    let adArray = adData.promotion;
    if (adArray.length > 0) {
      adArray = shuffleArray(adArray);
    }

    this.adArray = adArray;

    this.refreshAdItems();
    this.intervalRefresh();
  },

  refreshAdItems() {
    const current = this.currentAd,
      length = this.adNodes.length,
      [newCurrent, items] = this.getAdItemByLength(current, length);

    this.currentAd = newCurrent;

    this.adNodes.forEach((ele, index) => {
      if (ele.children.length) {
        const adNode = ele.children[0];
        const adEntity = items[index];
        let adItem = adNode.getComponent("ZSAdItem");
        if (adItem) {
          adItem.init(adEntity);
        }
        setTimeout(() => {
          this.shapeAdIcon(adItem.icon.node);
        }, 10);
      } else {
        let adNode = cc.instantiate(this.itemPrefab);
        const adEntity = items[index];
        let adItem = adNode.getComponent("ZSAdItem");
        if (adItem) {
          adItem.init(adEntity);
        }
        ele.addChild(adNode);
        setTimeout(() => {
          this.shapeAdIcon(adItem.icon.node);
        }, 10);
      }
    });
  },

  getAdItemByLength(current, length) {
    let items = [];
    let newCurrent = current;
    for (let index = 0; index < length; index++) {
      newCurrent++;
      if (newCurrent >= this.adArray.length) {
        newCurrent = 0;
      }
      items.push(this.adArray[newCurrent]);
    }

    return [newCurrent, items];
  },

  intervalRefresh() {},

  cleanintervalRefresh() {
    if (this.intervalRes) {
      clearInterval(this.intervalRes);
      this.intervalRes = "";
    }
  },

  shapeAdIcon(iconNode) {
    cc.tween(iconNode)
      .to(0.1, { angle: 14 })
      .to(0.2, { angle: -14 })
      .to(0.2, { angle: 10 })
      .to(0.2, { angle: -10 })
      .to(0.1, { angle: 0 })
      .start();
  },
});

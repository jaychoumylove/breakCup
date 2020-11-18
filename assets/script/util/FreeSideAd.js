import zsSdk from "zs.sdk";
import Common from "./common";
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
    if (zsLoad.versionCheck()) {
      this.refreshAds();
    }
  },

  onDestroy() {
    this.cleanintervalRefresh();
  },

  refreshAds() {
    zsSdk.loadAd((res) => {
      this.showAd(res);
    });
  },

  showAd(adData) {
    let adArray = adData.promotion;
    if (adArray.length > 0) {
      adArray = Common.shuffleArray(adArray);
      for (let i = 0; i < adArray.length; i++) {
        let adEntity = adArray[i];
        cc.loader.load(
          { url: adEntity.app_icon, type: "png" },
          (err, texture) => {
            if (texture) {
              adArray[i].app_icon = new cc.SpriteFrame(texture);
            }
          }
        );
      }
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

  intervalRefresh() {
    this.intervalRes = setInterval(() => {
      if (this.adArray.length) {
        this.refreshAdItems();
      }
    }, this.refreshAd * 1000);
  },

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

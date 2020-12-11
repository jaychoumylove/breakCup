import { shuffleArray } from "../common";
import { versionCheck, getZsLoadData } from "../ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    itemPrefab: cc.Prefab,
    adParent: cc.Node,
    scrollDirect: cc.Vec2,
  },

  onLoad() {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      if (versionCheck()) {
        this.initWH();
        this.refreshAds();
      }
    }
  },

  initWH() {
    this.adParent.height = this.itemPrefab.data.height;
    this.adParent.anchorX = 0;
    this.adParent.parent.height = this.adParent.height;
    this.adParent.parent.width = cc.winSize.width;
    this.adParent.x =
      (this.scrollDirect.x > 0
        ? this.adParent.parent.width
        : -this.adParent.parent.width) / 2;
  },

  refreshAds() {
    getZsLoadData((res) => {
      this.showAd(res);
    });
  },

  showAd(adData) {
    let adArray = adData.promotion;
    // 打乱数组
    adArray = shuffleArray(adArray);

    if (adArray.length > 0) {
      for (let i = 0; i < adArray.length; i++) {
        const adEntity = adArray[i];
        let adNode = cc.instantiate(this.itemPrefab);
        this.adParent.addChild(adNode);
        let adItem = adNode.getComponent("ZSAdItem");
        if (adItem) {
          adItem.init(adEntity);
        }
      }
    }

    if (this.scrollDirect) {
      const defaultPos = { x: this.adParent.x, y: this.adParent.y };
      const activePos = { x: this.adParent.x, y: this.adParent.y };
      const itemW =
        this.itemPrefab.data.width +
        this.adParent.getComponent(cc.Layout).spacingX;
      const itemH =
        this.itemPrefab.data.height +
        this.adParent.getComponent(cc.Layout).spacingY;
      if (this.scrollDirect.x) {
        const maxX = this.adParent.width * itemW - this.adParent.parent.width;
        activePos.x = maxX * this.scrollDirect.x;
      }

      if (this.scrollDirect.y) {
        const maxY = this.adParent.height - this.adParent.parent.height;
        activePos.y = maxY * this.scrollDirect.y;
      }

      let up = cc.tween().to(10, activePos),
        down = cc.tween().to(10, defaultPos),
        action = cc.tween().then(up).then(down);
      cc.tween(this.adParent).repeatForever(action).start();
    }
  },
});

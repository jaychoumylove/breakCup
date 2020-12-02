import Common from "../common";
import { versionCheck, getZsLoadData } from "../ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    itemPrefab: cc.Prefab,
    adParent: cc.Node,
    scrollDirect: cc.Vec2,

    rowNum: 3,
    colNum: 8,
  },

  onLoad() {
    if (versionCheck()) {
      this.refreshAds();
    }
  },

  refreshAds() {
    getZsLoadData((res) => {
      this.showAd(res, this.rowNum * this.colNum, () => {
        // 防止结构错乱主动更新
        this.adParent.getComponent(cc.Layout).updateLayout();
        this.initUpDownTween();
      });
    });
  },

  showAd(adData, number, call) {
    let adArray = adData.promotion;

    if (adArray.length > 0) {
      adArray = Common.shuffleArray(adArray); // 打乱数组
      let index = 0;
      for (let i = 0; i < number; i++) {
        if (index >= adArray.length) {
          index = 0;
        }
        const adEntity = adArray[index];
        let adNode = cc.instantiate(this.itemPrefab);
        this.adParent.addChild(adNode);
        let adItem = adNode.getComponent("ZSAdItem");
        if (adItem) {
          adItem.init(adEntity, i);
        }
        index++;
      }
      call && call();
    }
  },

  initUpDownTween() {
    const defaultPos = { x: this.adParent.x, y: this.adParent.y };
    const activePos = { x: this.adParent.x, y: this.adParent.y };
    const itemW =
      this.itemPrefab.data.width +
      this.adParent.getComponent(cc.Layout).spacingX;
    const itemH =
      this.itemPrefab.data.height +
      this.adParent.getComponent(cc.Layout).spacingY;
    if (this.scrollDirect.x) {
      const maxX =
        this.adParent.x + this.adParent.width - this.adParent.parent.width;
      activePos.x = maxX * this.scrollDirect.x;
    }

    if (this.scrollDirect.y) {
      const maxY =
        this.adParent.y + this.adParent.height - this.adParent.parent.height;
      activePos.y = maxY * this.scrollDirect.y;
    }

    let up = cc.tween().to(4, activePos),
      down = cc.tween().to(4, defaultPos),
      action = cc.tween().then(up).then(down);
    this.moveTween = cc.tween(this.adParent).repeatForever(action).start();
  },
});

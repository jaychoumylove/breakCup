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

    direction: cc.Vec2,
  },

  onLoad() {
    if (versionCheck()) {
      // this.initToggle();
      // this.initClick();
      this.refreshAds();
    }
  },

  refreshAds() {
    getZsLoadData((res) => {
      this.showAd(res, this.rowNum * this.colNum, () => {
        // 防止结构错乱主动更新
        this.adParent.getComponent(cc.Layout).updateLayout();
      });
    });
  },

  initToggle() {
    this.status = false; // 隐藏状态
    this.showNode = cc.find("showMore", this.node);
    const showX = (cc.winSize.width - this.showNode.width) / 2;
    if (this.direction.x > 0) {
      // right
      this.showNode.x = showX;
    } else {
      this.showNode.x = -showX;
    }
    this.moreBox = cc.find("more", this.node);
    const bgWidth = this.itemPrefab.data.width * this.rowNum; // 抽屉最多一行3个广告
    const bgHeight = this.itemPrefab.data.width * this.rowNum; // 抽屉最多一行3个广告
    this.adParent.width = bgWidth;
    this.adParent.x = -bgWidth / 2;
    this.adParent.y = bgHeight / 2;
    this.adParent.parent.width = bgWidth;
    this.adParent.parent.height = bgHeight;
    this.adParent.parent.parent.width = bgWidth;
    this.adParent.parent.parent.height = bgHeight;
    this.hideNode = cc.find("hide", this.moreBox);
    this.moreBox.width = bgWidth + this.hideNode.width;
    this.moreBox.height = bgHeight;

    this.moveMoreX = (cc.winSize.width - this.moreBox.width) / 2;
    this.moveMoreX = this.direction.x > 0 ? this.moveMoreX : -this.moveMoreX;
    if (this.direction.x > 0) {
      // this.moreBox.x = this.moveMoreX + bgWidth;
      this.hideNode.x = this.showNode.x - bgWidth;
    } else {
      // this.moreBox.x = this.moveMoreX - bgWidth;
      this.hideNode.x = this.showNode.x + bgWidth;
    }
    this.moveWidth = bgWidth;
  },

  initClick() {
    this.showNode.on("click", this.showMore, this);
    this.hideNode.on("click", this.hideMore, this);
  },

  showAd(adData, number, call) {
    let adArray = adData.promotion;
    adArray = Common.shuffleArray(adArray);

    if (adArray.length > 0) {
      let index = 0;

      if (adArray.length > 0) {
        adArray = Common.shuffleArray(adArray);
        // for (let i = 0; i < adArray.length; i++) {
        //   let adEntity = adArray[i];
        //   cc.loader.load(
        //     { url: adEntity.app_icon, type: "png" },
        //     (err, texture) => {
        //       if (texture) {
        //         adArray[i].app_icon = new cc.SpriteFrame(texture);
        //       }
        //     }
        //   );
        // }
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
    }
  },

  showMore() {
    if (true == this.status) return;
    this.status = true;
    this.showNode.active = false;
    if (this.darkScreen) {
      this.darkScreen.active = true;
    }
    cc.tween(this.moreBox)
      .to(0.1, { x: this.moveMoreX })
      .call(() => {
        this.hideNode.active = true;
        if (this.scrollDirect) {
          if (!this.moveTween) {
            this.initUpDownTween();
          }
        }
      })
      .start();
  },

  toogleShowHide(status, red) {
    // 切换show hide icon
    if (status) {
      this.showNode.getComponent(cc.Sprite).spriteFrame = red
        ? this.showRedIcon
        : this.showIcon;
    } else {
      this.showNode.getComponent(cc.Sprite).spriteFrame = this.hideIcon;
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

  hideMore() {
    if (false == this.status) return;
    this.status = false;
    this.hideNode.active = false;
    if (this.darkScreen) {
      this.darkScreen.active = false;
    }
    const x = this.direction.x > 0 ? cc.winSize.width : -cc.winSize.width;
    cc.tween(this.moreBox)
      .to(0.1, { x: x })
      .call(() => {
        this.showNode.active = true;
      })
      .start();
  },
});

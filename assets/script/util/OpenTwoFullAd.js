import { versionCheck, getCfgVal, getZsLoadData } from "./ZSLoad";
import Common from "./common";

cc.Class({
  extends: cc.Component,

  properties: {
    adContainer: cc.Node,
    adItem: cc.Prefab,
    defaultPos: null,
    rowNum: cc.Integer,
    scrollDirection: "up",

    scrolling: false,
    tweenAct: null,
    hasShowBannerAd: false,
    isback: false,
  },

  onLoad() {
    this.initContainerWH();
    getZsLoadData((res) => {
      this.showAd(res, 2 * (this.rowNum + 4), () => {
        this.adContainer.getComponent(cc.Layout).updateLayout();
        this.checkHeightForScroll();
      });
    });
    this.checkWorseClick();
    this.node
      .getChildByName("bottom")
      .getChildByName("go on")
      .on("click", this.clickHandle, this);
  },

  initContainerWH() {
    const winWidth = cc.winSize.width;
    const margin = this.adContainer.getComponent(cc.Layout).spacingX;
    const itemWidth = this.adItem.data.width;

    const itemNumber = (winWidth - margin) / (itemWidth + margin);
    this.rowNum = parseInt(itemNumber.toString());
    // const containerW = (itemWidth + margin) * this.rowNum + margin;
    const w = winWidth;
    this.adContainer.parent.width = w - 40;
    this.adContainer.parent.parent.width = w;
    this.adContainer.parent.parent.parent.width = w;
    this.adContainer.x = -this.adContainer.parent.width / 2;
    const bottomNode = cc.find("bottom", this.node);
    bottomNode.width = winWidth;
    bottomNode.getChildByName("bg").width = winWidth;
  },

  /**
   * 是否误触
   */
  checkWorseClick() {
    if (!versionCheck()) {
      // 审核中不展示广告
      this.hasShowBannerAd = true;
      return;
    }
    if (parseInt(getCfgVal("zs_switch")) < 1) {
      // 未开启误触
      this.hasShowBannerAd = true;
      return;
    }
  },

  clickHandle() {
    // 显示banner广告
    if (!this.hasShowBannerAd) {
      setTimeout(() => {
        const ad = cc.find("bgm").getComponent("WechatAdService");
        ad.setGBAd("banner", true, {
          width: 300,
          height: 100,
          pos: "middleBottom",
        });
        this.hasShowBannerAd = true;
        setTimeout(() => {
          ad.setGBAd("banner", false);
        }, getCfgVal("zs_banner_banner_time", 2000));
      }, 1000);
    } else {
      console.info("gonext");
      // let nextlevel = this.node.parent.getChildByName("successUI").getComponent("Settlement").nextLevelName;
      // cc.director.loadScene(nextlevel);
      this.node.removeFromParent();
    }
  },

  showAd(adData, number, call) {
    let adArray = adData.promotion;

    if (adArray.length > 0) {
      adArray = Common.shuffleArray(adArray);
      let index = 0;
      for (let i = 0; i < number; i++) {
        if (index >= adArray.length) {
          index = 0;
        }
        const adEntity = adArray[index];
        let adNode = cc.instantiate(this.adItem);
        this.adContainer.addChild(adNode);
        let adItem = adNode.getComponent("ZSAdItem");
        if (adItem) {
          adItem.init(adEntity);
        }
        index++;
      }

      const randInt = Common.getRandNumber(1);
      this.adContainer.children[randInt]
        .getComponent("ZSAdItem")
        .navigate2Mini();
      call && call();
    }
  },

  checkHeightForScroll() {
    if (this.adContainer.width && !this.tweenAct) {
      const max = this.adContainer.width - this.adContainer.parent.width;
      cc.log(max);
      const dft = { x: this.adContainer.x },
        act = { x: this.adContainer.x - max };
      let up = cc.tween().to(3, act),
        down = cc.tween().to(3, dft),
        action = cc.tween().then(up).then(down);
      this.tweenAct = cc.tween(this.adContainer).repeatForever(action).start();
    }
  },
});

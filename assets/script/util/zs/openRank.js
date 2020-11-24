import Common from "../common";
import { versionCheck, getCfgVal, getZsLoadData } from "../ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    adItem: cc.Prefab,
    adContainer: cc.Node,
    defaultPos: null,
    rowNum: cc.Integer,
    scrollDirection: "up",

    scrolling: false,
    tweenAct: null,
    hasShowBannerAd: false,
    isback: false,
  },

  onLoad() {
    this.initBtnPos();
    // this.initContainerWH();
    getZsLoadData((res) => {
      this.showAd(res, () => {
        this.adContainer.getComponent(cc.Layout).updateLayout();
        // this.scrolling = true;
      });
    });
    // this.defaultPos = { x: this.adContainer.x, y: this.adContainer.y };
    this.checkWorseClick();
    this.node
      .getChildByName("bottom")
      .getChildByName("go on")
      .on("click", this.clickHandle, this);
  },

  initBtnPos() {
    const btnNode = cc.find("bottom", this.node);
    btnNode.x = 0;
    btnNode.y =
      -(cc.winSize.height - btnNode.getChildByName("go on").height) / 2;
  },

  initContainerWH() {
    const winWidth = cc.winSize.width;
    const margin = this.adContainer.getComponent(cc.Layout).spacingX;
    const itemWidth = this.adItem.data.width;

    const itemNumber = (winWidth - itemWidth) / (itemWidth + margin);
    this.rowNum = parseInt(itemNumber.toString()) + 1;
    const w = winWidth;
    const paddingRow = w - (itemWidth + margin) * this.rowNum + margin - 2;
    this.adContainer.width = w;
    this.adContainer.x = -(w / 2);
    this.adContainer.getComponent(cc.Layout).paddingLeft = paddingRow / 2;
    this.adContainer.getComponent(cc.Layout).paddingRight = paddingRow / 2;
    this.adContainer.parent.width = w;
    this.adContainer.parent.getChildByName("bg").width = w;
  },

  update(dt) {
    if (this.adContainer.height && this.scrolling) {
      // const max = this.adContainer.height - this.adContainer.parent.height,
      //   maxY = this.defaultPos.y + max;
      // if (this.scrollDirection == "down") {
      //   this.adContainer.y -= 100 * dt;
      //   if (this.adContainer.y <= this.defaultPos.y) {
      //     this.scrollDirection = "up";
      //   }
      // }
      // if (this.scrollDirection == "up") {
      //   this.adContainer.y += 100 * dt;
      //   if (this.adContainer.y >= maxY) {
      //     this.scrollDirection = "down";
      //   }
      // }
    }
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
    cc.log(this.hasShowBannerAd);
    if (!this.hasShowBannerAd) {
      setTimeout(() => {
        const ad = cc.find("bgm").getComponent("WechatAdService");
        const style = ad.transformPos(cc.find("bottom", this.node), {
          width: 400,
          height: 240,
        });
        ad.setGBAd("banner", true, style, () => {
          console.log("added");
        });
        this.hasShowBannerAd = true;
        cc.log(this.hasShowBannerAd);
        setTimeout(() => {
          const btnNode = cc.find("bottom", this.node);
          cc.log(btnNode.y);
          cc.log(btnNode.getChildByName("go on").height);
          cc.log(cc.winSize.height);
          btnNode.y =
            -(cc.winSize.height - btnNode.getChildByName("go on").height) / 2 +
            120;
          cc.log(btnNode.y);
        }, getCfgVal("zs_banner_banner_time", 2000));
      }, 1000);
      return;
    } else {
      console.log("gonext");
      // this.node.removeFromParent();
      // this.node.active = false;
      // this.node.destroy();
      if (cc.director.getScene().name != "home") {
        const ad = cc.find("bgm").getComponent("WechatAdService");
        ad.setGBAd("banner", false);
      }
      this.node.removeFromParent();
    }
  },

  showAd(adData, call) {
    let adArray = adData.promotion;
    if (adArray.length > 0) {
      this.showTopAd(adArray.slice(0, 3));
      for (let i = 3; i < adArray.length; i++) {
        const adEntity = adArray[i];
        let adNode = cc.instantiate(this.adItem);
        this.adContainer.addChild(adNode);
        let adItem = adNode.getComponent("adRowItem");
        if (adItem) {
          adItem.init(adEntity, i);
        }
      }
      setTimeout(() => {
        const randInt = Common.randomIntFromInterval(0, adArray.length - 3);
        this.adContainer.children[randInt]
          .getComponent("adRowItem")
          .navigate2Mini();
        call && call();
      }, 1);
    }
  },

  showTopAd(array) {
    const oneNode = cc.find("top/one", this.node);
    const twoNode = cc.find("top/two", this.node);
    const threeNode = cc.find("top/three", this.node);
    [oneNode, twoNode, threeNode].map((item, index) => {
      const adEntity = array[index];
      let adItem = item.getComponent("ZSAdItem");
      if (adItem) {
        adItem.init(adEntity, index);
      }
    });
  },
});

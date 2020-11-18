import zsSdk from "zs.sdk";
import Common from "./common";
import { versionCheck, getCfgVal } from "./ZSLoad";

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
    this.initBtnPos();
    this.initContainerWH();
    zsSdk.loadAd((res) => {
      this.showAd(res, this.rowNum * 5, () => {
        this.adContainer.getComponent(cc.Layout).updateLayout();
        this.scrolling = true;
      });
    });
    this.defaultPos = { x: this.adContainer.x, y: this.adContainer.y };
    this.checkWorseClick();
    this.node
      .getChildByName("bottom")
      .getChildByName("go on")
      .on("click", this.clickHandle, this);
    this.adContainer.getComponent(cc.Layout).updateLayout();
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
      const max = this.adContainer.height - this.adContainer.parent.height,
        maxY = this.defaultPos.y + max;
      if (this.scrollDirection == "down") {
        this.adContainer.y -= 100 * dt;
        if (this.adContainer.y <= this.defaultPos.y) {
          this.scrollDirection = "up";
        }
      }
      if (this.scrollDirection == "up") {
        this.adContainer.y += 100 * dt;
        if (this.adContainer.y >= maxY) {
          this.scrollDirection = "down";
        }
      }
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
    if (!this.hasShowBannerAd) {
      // @ts-ignore wx is defined!
      const wxSys = wx.getSystemInfoSync();
      setTimeout(() => {
        WxAd.getInstance().showBannerAd({
          height: 80,
          width: 300,
          top: wxSys.screenHeight - 100,
          left: (wxSys.screenWidth - 300) / 2,
        });
        this.hasShowBannerAd = true;
        // this.schedule(() => {
        //   WxAd.getInstance().hideBan();
        // }, ZsLoad.getCfgVal("zs_banner_banner_time", 2000) / 1000);
      }, 1000);
    } else {
      console.info("gonext");
      if (this.isback) {
        cc.director.loadScene("MainMenu");
      }
      this.node.removeFromParent();
    }
  },

  showAd(adData, number, call) {
    let adArray = adData.promotion;

    if (adArray.length > 0) {
      let index = 0;
      adArray = Common.shuffleArray(adArray);
      cc.log(number);
      for (let i = 0; i < number; i++) {
        cc.log(i);
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
});

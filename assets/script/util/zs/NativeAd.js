cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.nativeAd = qg.createNativeAd({
      adUnitId: "263523",
    });
    this.node.active = false;
    this.nativeAd.onLoad((res) => {
      this.init(res);
      this.nativeAd.offLoad();
    });
    this.nativeAd.onError((err) => {
      console.log(JSON.stringify(err));
    });
    this.nativeAd.load();
  },

  init(adInfo) {
    const ad = adInfo.adList[0];

    // cc.assetManager.loadRemote('http://www.cloud.com/test1.jpg', (err, texture) => console.log(err));
    cc.assetManager.loadRemote(ad.imgUrlList[0], (err, texture) => {
      if (err) {
        console.log(err);
      }
      if (texture) {
        const spriteFrame = new cc.SpriteFrame(texture);
        cc
          .find("image", this.node)
          .getComponent(cc.Sprite).spriteFrame = spriteFrame;

        cc.find("image", this.node).width = 440;
        cc.find("image", this.node).height = 220;
      }
    });

    cc.find("desc", this.node).getComponent(cc.Label).string = ad.desc;
    cc.find("leftTitle", this.node).getComponent(cc.Label).string = ad.title;
    cc.find("rightTip", this.node).getComponent(cc.Label).string = "广告";
    cc.find("adbtn/Background/Label", this.node).getComponent(cc.Label).string =
      ad.clickBtnTxt;

    cc.find("adbtn", this.node).on("click", this.handleAdClick, this);
    cc.find("image", this.node).on(
      cc.Node.EventType.TOUCH_START,
      this.handleAdClick,
      this
    );
    cc.find("desc", this.node).on(
      cc.Node.EventType.TOUCH_START,
      this.handleAdClick,
      this
    );
    cc.find("close", this.node).on("click", this.handleCloseClick, this);
    this.adId = ad.adId;
    this.node.active = true;
    this.nativeAd.reportAdShow({
      adId: this.adId,
    });
  },

  handleAdClick() {
    console.log("reportAdShow");
    this.nativeAd.reportAdClick({
      adId: this.adId,
    });
    this.node.destroy();
  },

  handleCloseClick() {
    console.log("handleCloseClick");
    this.node.destroy();
  },
});

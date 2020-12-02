cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    // this.nativeAd = qg.createNativeAd({
    //     adUnitId: 'xxx'
    //   });
    this.init();
  },

  init(adInfo) {
    if (!adInfo) {
      adInfo = {
        adList: [
          {
            adId: "ad9dead6-edcc-4aae-801c-39225762431d",
            clickBtnTxt: "点击查看",
            creativeType: 6,
            desc: "9块9抢充话费100元",
            iconUrlList: [],
            icon: "",
            interactionType: 1,
            logoUrl: "",
            title: "拼多多",
            imgUrlList: [
              "http://images.pinduoduo.com/marketing_api/2020-09-14/0f24e2c4-a95d-40e6-8477-09687d0319d1.jpeg",
            ],
          },
        ],
        code: 0,
        msg: "ok",
      };
    }

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
  },

  handleAdClick() {
    cc.log("adclick");
  },

  handleCloseClick() {
    this.node.destroy();
  },
});

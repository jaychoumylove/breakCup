import { zsLoad, getCfgVal } from "../ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.isWorse = false;
    this.nativeAdUnitId = Math.random() > 0.5 ? "263522" : "263523";
    if (cc.sys.platform == cc.sys.OPPO_GAME) {
      this.nativeAd = qg.createNativeAd({
        adUnitId: this.nativeAdUnitId,
      });
      this.node.active = false;
      this.nativeAd.onLoad((res) => {
        this.init(res);
        this.nativeAd.offLoad();
      });
      this.nativeAd.onError((err) => {
        console.log(JSON.stringify(err));
        this.nativeAd = qg.createNativeAd({
          adUnitId:
            parseInt(this.nativeAdUnitId) > 263522 ? "263522" : "263523",
        });
        this.nativeAd.load();
        this.nativeAd.offError();
      });
      this.nativeAd.load();
      this.isWorse = parseInt(getCfgVal("zs_switch"));
    } else {
      zsLoad(() => {
        this.isWorse = parseInt(getCfgVal("zs_switch"));
      });
      let a = {
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
      this.init(a);
    }
  },

  init(adInfo) {
    const ad = adInfo.adList[0];
    const imageNode = cc.find("image", this.node),
      adIconNode = cc.find("adicon", imageNode);

    cc.assetManager.loadRemote(ad.imgUrlList[0], (err, texture) => {
      if (err) {
        console.log(err);
      }
      if (texture) {
        const spriteFrame = new cc.SpriteFrame(texture);
        adIconNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;

        adIconNode.width = 380;
        adIconNode.height = 190;
      }
    });

    cc.find("desc", imageNode).getComponent(cc.Label).string = ad.desc;
    cc
      .find("btn/Background/Label", this.node)
      .getComponent(cc.Label).string = this.isWorse ? "查看广告" : "点击跳过";

    cc.find("btn", this.node).on("click", this.handleAdClick, this);
    cc.find("image/adicon", this.node).on(
      cc.Node.EventType.TOUCH_START,
      this.handleAdClick,
      this
    );
    cc.find("image/adicon/close", this.node).on(
      cc.Node.EventType.TOUCH_START,
      this.handleCloseClick,
      this
    );
    cc.find("image/desc", this.node).on(
      cc.Node.EventType.TOUCH_START,
      this.handleAdClick,
      this
    );
    this.adId = ad.adId;
    this.node.active = true;
    this.nativeAd.reportAdShow({
      adId: this.adId,
    });
  },

  handleAdClick(event) {
    console.log("handleAdClick");
    this.nativeAd.reportAdClick({
      adId: this.adId,
    });
    this.node.destroy();
    event.stopPropagation();
  },

  handleCloseClick(event) {
    console.log("handleCloseClick");
    this.node.destroy();
    event.stopPropagation();
  },

  handleWorseClick(event) {
    console.log("handleWorseClick");
    console.log(this.isWorse);
    if (this.isWorse) {
      this.handleAdClick(event);
    } else {
      console.log(this.isWorse);
      this.handleCloseClick(event);
    }
  },
});

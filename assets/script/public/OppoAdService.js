cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    // this._currentScene = cc.director.getScene().name;
    // this._lastScene = null;
    if (cc.sys.platform == cc.sys.OPPO_GAME) {
      qg.setEnableDebug({
        enableDebug: true, // true 为打开，false 为关闭
        success: () => {
          // 以下语句将会在 vConsole 面板输出
          console.log("test consol log");
          console.info("test console info");
          console.warn("test consol warn");
          console.debug("test consol debug");
          console.error("test consol error");
          setTimeout(() => {
            this.show = false;
          }, 3000);
        },
        complete: function () {},
        fail: function () {},
      });
      this.initAdIds();
      this.show = false;
      setTimeout(() => {
        this.initAD();
      }, 1);
    }
  },

  update() {
    if (this.show) return;
    if (this.nativeAdunit || this.rewardedVideo || this.bannerAd) {
      console.log(JSON.stringify(this.nativeAdunit));
      console.log(JSON.stringify(this.rewardedVideo));
      console.log(JSON.stringify(this.bannerAd));
      if (this.nativeAdunit && this.rewardedVideo && this.bannerAd) {
        this.show = true;
      }
    }
  },

  //   oppo打碎他的瓶子：
  // 包名：com.hnml.dstdpz.nearme.gamecenter
  // appid：30419493
  // appkey： 6C3gW4V5geo8GsOcCWg8wcWkw(勿外泄)
  // appsecret：57cb23Aee5F83Cab60B30758204b69D9(勿外泄)
  // 广告位id:
  // 打碎他的瓶子-互推浮层
  // ID: 263504
  // 打碎他的瓶子-banner1
  // ID: 263519
  // 打碎他的瓶子-banner2
  // ID: 263520
  // 打碎他的瓶子-开屏广告
  // ID: 263521
  // 打碎他的瓶子-原生1
  // ID: 263522
  // 打碎他的瓶子-原生2
  // ID: 263523
  // 打碎他的瓶子-激励视频
  // ID: 263524

  initAdIds() {
    // this.gridAdunit = "263504";
    // this.intertitialAdunit = "263521";
    this.bannerAdunit1 = "263519";
    this.bannerAdunit2 = "263520";
    this.nativeAdunit1 = "263522";
    this.nativeAdunit2 = "263523";
    this.rewardedVideoAdunit = "263524";
  },

  initAD() {
    this.rewardedVideo = qg.createRewardedVideoAd({
      adUnitId: this.rewardedVideoAdunit,
    });
    console.log(JSON.stringify(this.rewardedVideo));
    this.rewardedVideo.onError((err) => {
      console.log("rewardedVideoAdErr");
      console.log(JSON.stringify(err));
    });
    // banner广告
    this.bannerAd = qg.createBannerAd({
      adUnitId: this.bannerAdunit1,
    });
    this.bannerAd.onLoad((i) => {
      console.log("Onloadonload");
      console.log(JSON.stringify(this.bannerAd));
      console.log(JSON.stringify(i));
    });
    this.bannerAd.onError((err) => {
      console.log("bannerAdErr");
      console.log(JSON.stringify(this.bannerAd));
      console.log(JSON.stringify(err));
    });

    this.nativeAdunit = qg.createNativeAd({
      adUnitId: this.nativeAdunit1,
    });
    this.nativeAdunit.onError(function (err) {
      console.log("nativeAdunitErr");
      console.log(JSON.stringify(this.nativeAdunit));
      console.log(JSON.stringify(err));
    });
    this.nativeAdunit.onLoad((res) => {
      console.log("nativeAdunitLOADed");
      console.log(JSON.stringify(this.nativeAdunit));
      console.log(JSON.stringify(res));
    });
    console.log("nativeAdunitLOAD");
    console.log(JSON.stringify(this.nativeAdunit));
    this.nativeAdunit.load();
  },

  openVideoWithCb(call) {
    console.log(this.rewardedVideoAdunit);
    if (this.rewardedVideo) {
      this.setVideoScallBack(call);
      this.rewardedVideo.show().catch((err) => {
        // 加载失败重试
        console.log(JSON.stringify(this.rewardedVideo));
        console.log(JSON.stringify(err));
        this.rewardedVideo.load().then(() => {
          this.rewardedVideo.show();
        });
      });
    } else {
      return false;
    }
  },

  setVideoScallBack(call) {
    console.log(JSON.stringify(this.rewardedVideo));
    if (this.rewardedVideo) {
      // 用户关闭了广告
      this.rewardedVideo.onClose((res) => {
        if ((res && res.isEnded) || typeof res === "undefined") {
          // 可以获得奖励
          console.log("got reward");
          call && call();
        } else {
          // 不能获得奖励
          console.log("no reward");
        }
      });
    }
  },

  showBannerAd(style) {
    if (this.bannerAd) {
      const styleMapKey = ["width", "height", "top", "left"];
      styleMapKey.map((ite) => {
        if (style.hasOwnProperty(ite)) {
          this.bannerAd.style[ite] = style[ite];
        }
      });

      this.bannerAd.show();
    } else {
      return false;
    }
  },

  setGBAd(targetAd, status, style, call) {
    console.log(this.bannerAdunit1);
    console.log(this.bannerAdunit1);
    let target;
    console.log(targetAd);
    if (targetAd == "banner") {
      target = this.bannerAd;
    }

    console.log(JSON.stringify(target));
    if (!target) return false;

    console.log(status);
    if (status) {
      const styleMapKey = ["width", "height", "top", "left"];
      let sys = qg.getSystemInfoSync();
      let hrate = sys.screenHeight / cc.winSize.height;
      let wrate = sys.screenWidth / cc.winSize.width;
      hrate = 1;
      wrate = 1;

      if (style.hasOwnProperty("pos")) {
        if (style.pos == "fullBottom") {
          style.height = style.height * hrate;
          style.width = sys.screenWidth;
          target.style.width = sys.screenWidth;
          target.style.top = sys.screenHeight - style.height;
          target.style.left = 0;
        }
        if (style.pos == "middleBottom") {
          style.height = style.height * hrate;
          style.width = style.width * wrate;
          target.style.top = sys.screenHeight;
          target.style.left = (sys.screenWidth - style.width) / 2;
        }
      }
      styleMapKey.map((ite) => {
        if (style.hasOwnProperty(ite)) {
          target.style[ite] = style[ite];
        }
      });
      console.log(JSON.stringify(target));
      target
        .show()
        .then(() => {
          console.log(JSON.stringify(target));
          console.log("call");
          call && call();
        })
        .catch((err) => {
          console.log("catch");
          console.log(JSON.stringify(err));
          console.log(JSON.stringify(target));
        });
    } else {
      target
        .hide()
        .then(() => {
          console.log("then");
          console.log(JSON.stringify(target));
          call && call();
        })
        .catch((err) => {
          console.log("catch");
          console.log(JSON.stringify(target));
          console.log(JSON.stringify(err));
        });
    }
  },

  // pos {x: 1, y: 1, anchorx:0.5, anchory:0.5}
  transformPos(node, size) {
    if (cc.sys.platform != cc.sys.OPPO_GAME) {
      cc.warn("oppo is undefined!");
      return null;
    }
    let wxsys = qg.getSystemInfoSync();
    let hrate = wxsys.screenHeight / cc.winSize.height;
    let wrate = wxsys.screenWidth / cc.winSize.width;

    const width = size.width * wrate;
    const height = size.height * hrate;

    const wxX = (node.x + cc.winSize.width / 2) * wrate;
    const wxY = (cc.winSize.height / 2 - node.y) * hrate;

    const left = wxX - width / 2;
    let addTop =
      wxsys.statusBarHeight > 20
        ? wxsys.statusBarHeight
        : wxsys.statusBarHeight * 2;
    const top = wxY - height / 2 + addTop;

    return {
      left,
      top,
      width,
      height,
    };
  },
});

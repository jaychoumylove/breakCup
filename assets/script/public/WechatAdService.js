cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    // this._currentScene = cc.director.getScene().name;
    // this._lastScene = null;
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      this.initAdIds();
      setTimeout(() => {
        this.initAD();
      }, 1);
    }
  },

  // update() {
  //   const currentScene = cc.director.getScene().name;
  //   if (this._currentScene != currentScene) {
  //     this._lastScene = this._currentScene;
  //     this._currentScene = currentScene;
  //     if (this.bannerAd) {
  //       this.bannerAd.hide();
  //     }
  //     if (this.gridAd) {
  //       this.gridAd.hide();
  //     }
  //   }
  // },

  initAdIds() {
    this.gridAdunit = "adunit-1e7e1a5d2eaec01a";
    this.intertitialAdunit = "adunit-18df80e922b70a1e";
    this.bannerAdunit = "adunit-4fd1f4ef4075c297";
    this.rewardedVideoAdunit = "adunit-2ff2aa7b659c8d6e";
  },

  initAD() {
    this.rewardedVideo = wx.createRewardedVideoAd({
      adUnitId: this.rewardedVideoAdunit,
    });
    this.rewardedVideo.onError((err) => {
      cc.log("rewardedVideoAdErr");
      cc.log(err);
    });
    // 插屏广告
    this.interstitialAd = wx.createInterstitialAd({
      adUnitId: this.intertitialAdunit,
    });
    this.interstitialAd.onError((err) => {
      cc.log("interstitialAdErr");
      cc.log(err);
    });
    // banner广告
    this.bannerAd = wx.createBannerAd({
      adUnitId: this.bannerAdunit,
      adIntervals: 60, // 每60秒刷新一次，这个数值最低30秒
    });
    this.bannerAd.onError((err) => {
      cc.log("bannerAdErr");
      cc.log(err);
    });
    // 格子广告
    this.gridAd = wx.createGridAd({
      adUnitId: this.gridAdunit,
      adIntervals: 60, // 每60秒刷新一次，这个数值最低30秒
      adTheme: "black",
    });
    this.gridAd.onError((err) => {
      cc.log("gridAdErr");
      cc.log(err);
    });
  },

  openVideoWithCb(call) {
    if (this.rewardedVideo) {
      this.setVideoScallBack(call);
      this.rewardedVideo.show().catch((err) => {
        // 加载失败重试
        this.rewardedVideo.load().then(() => {
          this.rewardedVideo.show();
        });
      });
    } else {
      return false;
    }
  },

  setVideoScallBack(call) {
    if (this.rewardedVideo) {
      // 用户关闭了广告
      this.rewardedVideo.onClose((res) => {
        if ((res && res.isEnded) || typeof res === "undefined") {
          // 可以获得奖励
          cc.log("got reward");
          call && call();
        } else {
          // 不能获得奖励
          cc.log("no reward");
        }
      });
    }
  },

  showInterstitialAd() {
    if (this.interstitialAd) {
      this.interstitialAd.show().catch((err) => {
        // 加载失败
        cc.warn(err);
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
    if (["banner", "grid"].indexOf(targetAd) < 0) return false;
    let target;
    if (targetAd == "banner") {
      target = this.bannerAd;
    }
    if (targetAd == "grid") {
      target = this.gridAd;
    }

    if (!target) return false;

    if (status) {
      const styleMapKey = ["width", "height", "top", "left"];

      if (style.hasOwnProperty("pos")) {
        if (style.pos == "fullBottom") {
          const wxSys = wx.getSystemInfoSync();
          target.style.width = wx.screenWidth;
          target.style.top = wxSys.screenHeight - style.height;
          target.style.left = 0;
        }
        if (style.pos == "middleBottom") {
          const wxSys = wx.getSystemInfoSync();
          target.style.top = wxSys.screenHeight - style.height;
          target.style.left = (wxSys.screenWidth - style.width) / 2;
        }
      }
      styleMapKey.map((ite) => {
        if (style.hasOwnProperty(ite)) {
          target.style[ite] = style[ite];
        }
      });

      target.show().then(() => {
        call && call();
      });
    } else {
      target.hide().then(() => {
        call && call();
      });
    }
  },

  // pos {x: 1, y: 1, anchorx:0.5, anchory:0.5}
  transformPos(node, size) {
    if (cc.sys.platform != cc.sys.WECHAT_GAME) {
      cc.warn("wx is undefined!");
      return null;
    }
    let wxsys = wx.getSystemInfoSync();
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

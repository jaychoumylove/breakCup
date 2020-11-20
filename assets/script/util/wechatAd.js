const gridAdunit = "adunit-1e7e1a5d2eaec01a",
  intertitialAdunit = "adunit-18df80e922b70a1e",
  bannerAdunit = "adunit-4fd1f4ef4075c297",
  rewardedVideoAdunit = "adunit-2ff2aa7b659c8d6e";

let rewardedVideo, interstitialAd, bannerAd, gridAd;

const initAD = () => {
  rewardedVideo = wx.createRewardedVideoAd({
    adUnitId: rewardedVideoAdunit,
  });
  rewardedVideo.onError((err) => {
    cc.log("rewardedVideoAdErr");
    cc.log(err);
  });
  // 插屏广告
  interstitialAd = wx.createInterstitialAd({
    adUnitId: intertitialAdunit,
  });
  interstitialAd.onError((err) => {
    cc.log("interstitialAdErr");
    cc.log(err);
  });
  // banner广告
  bannerAd = wx.createBannerAd({
    adUnitId: bannerAdunit,
    adIntervals: 60, // 每60秒刷新一次，这个数值最低30秒
  });
  bannerAd.onError((err) => {
    cc.log("bannerAdErr");
    cc.log(err);
  });
  // 格子广告
  gridAd = wx.createGridAd({
    adUnitId: gridAdunit,
    adIntervals: 60, // 每60秒刷新一次，这个数值最低30秒
    adTheme: "black",
  });
  gridAd.onError((err) => {
    cc.log("gridAdErr");
    cc.log(err);
  });
};

const openVideoWithCb = (call) => {
  if (rewardedVideo) {
    setVideoScallBack(call);
    rewardedVideo.show().catch((err) => {
      // 加载失败重试
      rewardedVideo.load().then(() => {
        rewardedVideo.show();
      });
    });
  } else {
    return false;
  }
};

const setVideoScallBack = (call) => {
  if (rewardedVideo) {
    // 用户关闭了广告
    rewardedVideo.onClose((res) => {
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
};

const showInterstitialAd = () => {
  if (interstitialAd) {
    interstitialAd.show().catch((err) => {
      // 加载失败
      cc.warn(err);
    });
  }
};
const showBannerAd = (style) => {
  if (bannerAd) {
    const styleMapKey = ["width", "height", "top", "left"];
    styleMapKey.map((ite) => {
      if (style.hasOwnProperty(ite)) {
        bannerAd.style[ite] = style[ite];
      }
    });

    bannerAd.show();
  } else {
    return false;
  }
};

const setGBAd = (targetAd, status, style, call) => {
  if (["banner", "grid"].indexOf(targetAd) < 0) return false;
  let target;
  if (targetAd == "banner") {
    target = bannerAd;
  }
  if (targetAd == "grid") {
    target = gridAd;
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
};

module.exports = {
  setGBAd,
  initAD,
  openVideoWithCb,
  showInterstitialAd,
};

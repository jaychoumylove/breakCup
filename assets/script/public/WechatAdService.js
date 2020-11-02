cc.Class({
    extends: cc.Component,

    properties: {
        rewardedVideoAdunit: cc.String,
        bannerAdunit: cc.String,
        intertitialAdunit: cc.String,
        gridAdunit: cc.String,
    },

    onLoad() {
        this._cuurentScene = cc.director.getScene().name;
        if (typeof wx == 'undefined') {
            cc.warn('wx is undefined!');
        } else {
            // 初始化广告单例
            // 激励视频
            setTimeout(() => {
                this.initAD();
            }, 1);
        }
    },

    update() {
        const currentScene = cc.director.getScene().name;
        if (this._cuurentScene != currentScene) {
            cc.log('hide');
            this._cuurentScene = currentScene;
            if (this.bannerAd) {
                this.bannerAd.hide();
            }
            if (this.gridAd) {
                this.gridAd.hide();
            }
        }
    },

    initAD() {
        this.rewardedVideo = wx.createRewardedVideoAd({adUnitId: this.rewardedVideoAdunit});
        this.rewardedVideo.onError(err => {
            cc.log('rewardedVideoAdErr');
            cc.log(err);
        });
        // 插屏广告
        this.interstitialAd = wx.createInterstitialAd({ adUnitId: this.intertitialAdunit });
        this.interstitialAd.onError(err => {
            cc.log('interstitialAdErr');
            cc.log(err);
        });
        // banner广告
        this.bannerAd = wx.createBannerAd({
            adUnitId: this.bannerAdunit,
            adIntervals: 60, // 每60秒刷新一次，这个数值最低30秒
        });
        this.bannerAd.onError(err => {
            cc.log('bannerAdErr');
            cc.log(err);
        });
        // 格子广告
        this.gridAd = wx.createGridAd({
            adUnitId: this.gridAdunit,
            adIntervals: 60, // 每60秒刷新一次，这个数值最低30秒
            adTheme: 'black'
        })
        this.gridAd.onError(err => {
            cc.log('gridAdErr');
            cc.log(err);
        });
    },

    openVideoWithCb(call) {
        if (this.rewardedVideo) {
            this.setVideoScallBack(call);
            this.rewardedVideo.show()
                .catch(err => {
                    // 加载失败重试
                    this.rewardedVideo.load()
                        .then(() => {
                            this.rewardedVideo.show();
                        })
                })
        } else {
            return false;
        }
    },

    setVideoScallBack(call) {
        if (this.rewardedVideo) {
            // 用户关闭了广告
            this.rewardedVideo.onClose(res => {
                if (res && res.isEnded || typeof res === 'undefined') {
                    // 可以获得奖励
                    cc.log('got reward');
                    call && call();
                } else {
                    // 不能获得奖励
                    cc.log('no reward')
                }
            })
        }
    },

    showInterstitialAd() {
        if (this.interstitialAd) {
            this.interstitialAd.show()
                .catch(err => {
                    // 加载失败
                    cc.warn(err);
                })
        }
    },

    showBannerAd(style) {
        if (this.bannerAd) {
            const styleMapKey = ['width', 'height', 'top', 'left'];
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

    showGridAd(style) {
        if (this.gridAd) {
            const styleMapKey = ['width', 'height', 'top', 'left'];
            styleMapKey.map((ite) => {
                if (style.hasOwnProperty(ite)) {
                    this.gridAd.style[ite] = style[ite];
                }
            });
    
            this.gridAd.show();
        } else {
            return false;
        }
    },

    test () {
        // const ad = this;
        // const call = () => {cc.log('work')};
        // const res = ad.openVideoWithCb(() => { call() });
        // if (false == res) {
        //     // 不在微信环境下直接获取奖励
        //     call();
        // }
        // ad.showInterstitialAd();
        // ad.showBannerAd({
        //     width: 400,
        //     height: 300,
        //     top: 100,
        //     left: 20,
        // });
        // ad.showGridAd({
        //     width: 330,
        //     top: 50,
        //     left: 20,
        // });
    },
});

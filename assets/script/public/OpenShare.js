cc.Class({
  extends: cc.Component,

  properties: {
    platform: cc.String,
  },

  onLoad() {
    // this.platformMap = {
    //     'wechat': wx
    // };
    // this.platformObject = this.platformMap[this.platform];
    if (this.platform == "wechat") {
      if (typeof wx == "undefined") {
      } else {
        this.openWxShare();
      }
    }
  },

  // update (dt) {},

  openWxShare() {
    wx.showShareMenu({ withShareTicket: true });
    wx.onShareAppMessage(function (res) {
      return {
        title: "经典火柴人游戏始终好玩，来吧！一起回味经典的乐趣。",
        imageUrl: null,
        success(res) {
          console.log(res);
        },
        fail(res) {
          console.log(res);
        },
      };
    });
  },
});

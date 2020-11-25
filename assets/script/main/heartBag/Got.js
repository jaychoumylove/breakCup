import { versionCheck, getCfgVal } from "../../util/ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    doubelNode: cc.Node,
    singleNode: cc.Node,
  },

  onLoad() {
    this.hasShowBannerAd = false;
    this.hasShowBannerAdTimer = undefined;
    this.doubelNode.on("click", this.pressDoubel, this);
    this.singleNode.on("click", this.pressSingle, this);
    this.node.on("_got", this.dispatchGot, this);
    this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
    this.checkWorseClick();
  },

  onDestroy() {
    // this.doubelNode.getComponent(cc.Button).node.off('click', this.pressDoubel, this);
    // this.singleNode.getComponent(cc.Button).node.off('click', this.pressSingle, this);
    this.node.off("_got", this.dispatchGot, this);
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

  // update (dt) {},

  dispatchGot() {
    this.doubelNode.active = true;
    this.initDoubelAction();
    setTimeout(() => {
      this.singleNode.active = true;
    }, 2000);
  },

  initDoubelAction() {
    const dft = {
        scale: this.doubelNode.scale,
      },
      act = {
        scale: 1.4,
      };
    let up = cc.tween().to(0.5, act),
      down = cc.tween().to(0.5, dft),
      action = cc.tween().then(up).then(down);
    cc.tween(this.doubelNode).repeatForever(action).start();
  },

  pressDoubel(evt) {
    this.AudioPlayer.playOnceMusic("button");
    cc.log("pressDoubel");
    const ad = cc.find("bgm").getComponent("WechatAdService");
    const call = () => {
      const dphevt = new cc.Event.EventCustom("_state_change", true);
      dphevt.setUserData({ heart: 2 });
      this.node.dispatchEvent(dphevt);
      this.goNext();
    };
    const res = ad.openVideoWithCb(() => {
      call();
    });
    if (false == res) {
      // 不在微信环境下直接获取奖励
      call();
    }
  },

  pressSingle(evt) {
    this.AudioPlayer.playOnceMusic("button");
    // 显示banner广告
    if (!this.hasShowBannerAd) {
      if (typeof this.hasShowBannerAdTimer == "undefined") {
        this.hasShowBannerAdTimer = setTimeout(() => {
          const ad = cc.find("bgm").getComponent("WechatAdService");
          const style = ad.transformPos(
            { x: this.singleNode.x, y: this.singleNode.y - 80 },
            {
              width: 400,
              height: 240,
            }
          );
          ad.setGBAd("banner", true, style, () => {
            console.log("added");
          });
          setTimeout(() => {
            this.hasShowBannerAd = true;
            ad.setGBAd("banner", false);
          }, getCfgVal("zs_banner_banner_time", 2000));
        }, 1000);
      }
      return;
    } else {
      this.goNext();
    }
  },

  goNext() {
    this.node.dispatchEvent(
      new cc.Event.EventCustom("_check_three_star", true)
    );
  },
});

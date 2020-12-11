import { isOppo, preloadlevel } from "../util/common";
import { versionCheck, getCfgVal, getOpenStatus } from "../util/ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    starGroupNode: cc.Node,
    middleFullStarSprite: cc.SpriteFrame,
    middleEmptyStarSprite: cc.SpriteFrame,
    sideFullStarSprite: cc.SpriteFrame,
    sideEmptyStarSprite: cc.SpriteFrame,

    checkDoubelNode: cc.Node,
    getRewardNode: cc.Node,

    doubelNode: cc.Node,
    redirectNode: cc.Node,
    replayNode: cc.Node,
    goNextNode: cc.Node,

    levelLabel: cc.Label,
    goldRewardLabel: cc.Label,

    grid33: cc.Prefab,

    reward: cc.Integer,
    doubel: true,
  },

  onLoad() {
    this.hasShowOnceBannerAd = false;
    this.hasShowTwiceBannerAd = false;
    this.cleanNative = false; // 默认不需要清理原生广告
    if (
      isOppo() &&
      versionCheck() &&
      !getOpenStatus() &&
      parseInt(getCfgVal("zs_native_limit"))
    ) {
      const bgNode = cc.find("Canvas/Main Camera/bg");
      cc.find("star", bgNode).active = false;
      cc.find("reward", bgNode).active = false;
      this.cleanNative = true;
    }

    this.checkWorseClick();
    this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
    this.AudioPlayer.playOnceMusic("win");
    this.initBtn();
    this.initReward();
    // 播放动画
    this.initStarAction();

    if (isOppo() && versionCheck()) {
      const ad = cc.find("bgm").getComponent("OppoAdService");
      ad.setGBAd("banner", false);
    }
  },

  /**
   * 是否误触
   */
  checkWorseClick() {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      if (!versionCheck()) {
        // 审核中不展示广告
        this.hasShowOnceBannerAd = true;
        this.hasShowTwiceBannerAd = true;
        return;
      }
      if (parseInt(getCfgVal("zs_switch")) < 1) {
        // 未开启误触
        this.hasShowOnceBannerAd = true;
        this.hasShowTwiceBannerAd = true;
      }
    } else {
      this.hasShowOnceBannerAd = true;
      this.hasShowTwiceBannerAd = true;
    }

    if (isOppo() && versionCheck() && parseInt(getCfgVal("zs_jump_switch"))) {
      if (!this.cleanNative) {
        this.addGrid33();
      }
    }
  },

  addGrid33() {
    const bgNode = cc.find("Canvas/Main Camera/bg");
    cc.find("star", bgNode).active = false;
    cc.find("reward", bgNode).active = false;
    const node = cc.instantiate(this.grid33);
    node.y = -35.315;
    bgNode.addChild(node);
  },

  initStarAction() {
    const { star, current } = JSON.parse(
      cc.sys.localStorage.getItem("currentLevel")
    );
    if (this.starGroupNode.active) {
      this.starGroupNode.children.map((ite, ind) => {
        if (ind < star) {
          setTimeout(() => {
            ite.getComponent(cc.Sprite).spriteFrame =
              ind == 1 ? this.middleFullStarSprite : this.sideFullStarSprite;
            this.AudioPlayer.playOnceMusic("collectStar");
          }, 500);
        } else {
          setTimeout(() => {
            ite.getComponent(cc.Sprite).spriteFrame =
              ind == 1 ? this.middleEmptyStarSprite : this.sideEmptyStarSprite;
          }, 500);
        }
      });
    }
    const levels = JSON.parse(localStorage.getItem("userLevel"));
    this.goNextNode.active = current < levels.length;
    this.levelLabel.string = current;
    if (current < levels.length) {
      preloadlevel(current);
    } else {
      preloadlevel(current + 1);
    }
  },

  initBtn() {
    // this.doubelNode.active = false;
    // this.redirectNode.active = true;
    if (isOppo()) {
      if (
        versionCheck() &&
        !getOpenStatus() &&
        parseInt(getCfgVal("zs_native_limit")) &&
        this.cleanNative
      ) {
        cc.find("goNext/Label", this.goNextNode).getComponent(cc.Label).string =
          "下一步";

        cc.resources.load("prefab/SingleNativeAd", cc.Prefab, (err, prefab) => {
          if (!err) {
            const node = cc.instantiate(prefab);
            node.y = -35.315;
            node.getComponent("NativeAd").callBack = () => {
              this.cleanNative = false;
              if (parseInt(getCfgVal("zs_jump_switch"))) {
                this.addGrid33();
              }
            };
            cc.find("Canvas").addChild(node);
            console.log("added prefab/SingleNativeAd");
          } else {
            // 出错直接返回到首页
            console.log("loaded prefab/SingleNativeAd failed");
            console.log(JSON.stringify(err));
          }
        });
      }
    }
    if (
      isOppo() &&
      versionCheck() &&
      !getOpenStatus() &&
      parseInt(getCfgVal("zs_native_limit")) &&
      this.cleanNative
    ) {
      if (parseInt(getCfgVal("zs_jump_time"))) {
        let time = parseInt(getCfgVal("zs_jump_time"));
        let call = () => {
          this.goNextNode.on("click", this.goNextLevel, this);
        };
        if (time < 1) {
          call();
        } else {
          if (time < 1000) {
            time *= 1000;
          }
          setTimeout(() => {
            call();
          }, time);
        }
      } else {
        this.goNextNode.on("click", this.goNextLevel, this);
      }
    } else {
      this.goNextNode.on("click", this.goNextLevel, this);
    }
    // this.checkDoubelNode
    //   .getComponent(cc.Toggle)
    //   .node.on("toggle", this.toggleDoubel, this);
  },

  initReward() {
    this.checkDoubelNode.getComponent(cc.Toggle).isCheck = this.doubel;
    this.dispatchGold(this.doubel);
  },

  checkHeart() {
    // 检查体力
    cc.log("check heart");
    const localStorage = cc.sys.localStorage;
    let state = JSON.parse(localStorage.getItem("userState"));
    return parseInt(state.heart) > 0;
  },

  replayCurrentLevel() {
    this.AudioPlayer.playOnceMusic("button");
    cc.log("replay");
    if (!this.hasShowOnceBannerAd) {
      setTimeout(() => {
        const ad = cc.find("bgm").getComponent("WechatAdService");
        const style = ad.transformPos(this.getRewardNode, {
          width: 400,
          height: 240,
        });
        ad.setGBAd("banner", true, style, () => {
          console.log("added");
        });
        this.hasShowOnceBannerAd = true;
        this.schedule(() => {
          this.redirectNode.y = this.doubelNode.y;
        }, getCfgVal("zs_banner_banner_time", 2000) / 1000);
      }, 1000);
      return;
    }
    const evt = new cc.Event.EventCustom("_toggle_loading", true);
    evt.setUserData({ status: true });
    this.node.dispatchEvent(evt);
    this.node.dispatchEvent(new cc.Event.EventCustom("_replay_current", true));
  },

  goNextLevel() {
    this.AudioPlayer.playOnceMusic("button");
    cc.log("go next level");
    if (!this.hasShowTwiceBannerAd) {
      setTimeout(() => {
        const ad = cc.find("bgm").getComponent("WechatAdService");
        const style = ad.transformPos(this.getRewardNode, {
          width: 400,
          height: 240,
        });
        ad.setGBAd("banner", true, style, () => {
          console.log("added");
        });
        this.hasShowTwiceBannerAd = true;
        this.schedule(() => {
          this.redirectNode.y = this.doubelNode.y;
        }, getCfgVal("zs_banner_banner_time", 2000) / 1000);
      }, 1000);
      return;
    }

    if (isOppo()) {
      if (this.cleanNative) {
        const singleNative = cc.find("Canvas/SingleNativeAd");
        if (singleNative) {
          singleNative.active = false;
          singleNative.destroy();
          if (parseInt(getCfgVal("zs_jump_switch"))) {
            this.addGrid33();
          }
        }
        this.cleanNative = false;
        return;
      }
    }

    // 去下一关
    const evt = new cc.Event.EventCustom("_toggle_loading", true);
    evt.setUserData({ status: true });

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      if (versionCheck()) {
        this.node.dispatchEvent(evt);
        const ad = cc.find("bgm").getComponent("WechatAdService");
        ad.setGBAd("banner", false);
        cc.resources.load(
          "prefab/openOneVertical",
          cc.Prefab,
          (err, prefab) => {
            if (!err) {
              const openNode = cc.instantiate(prefab);
              openNode.getComponent("OpenOneFullAd").isback = true;
              cc.find("Canvas").addChild(openNode);
            }
          }
        );
        return;
      }
    }
    if (isOppo()) {
      // 游戏结束去插屏原生广告
      // if (
      //   versionCheck() &&
      //   parseInt(getCfgVal("zs_jump_switch")) &&
      //   !getOpenStatus() &&
      //   parseInt(getCfgVal("zs_native_limit"))
      // ) {
      //   cc.resources.load("prefab/FullNativeAd", cc.Prefab, (err, prefab) => {
      //     if (!err) {
      //       const node = cc.instantiate(prefab);
      //       node.getComponent("NativeAd").backHome = true;
      //       cc.find("Canvas").addChild(node);
      //       console.log("added prefab/FullNativeAd backhome");
      //     } else {
      //       // 出错直接返回到首页
      //       console.log("loaded prefab/FullNativeAd failed, back home now");
      //       console.log(JSON.stringify(err));
      //       this.node.dispatchEvent(evt);
      //       cc.director.loadScene("home");
      //     }
      //   });
      //   return;
      // } else {
      //   this.node.dispatchEvent(evt);
      //   cc.director.loadScene("home");
      //   return;
      // }
      this.node.dispatchEvent(evt);
      cc.director.loadScene("home");
      return;
    }
    if (!this.checkHeart()) {
      const freeSide = cc.find("Canvas/Main Camera/freeSideL");
      if (freeSide) {
        freeSide.destroy();
      }
      return this.node.dispatchEvent(
        new cc.Event.EventCustom("_add_heart", true)
      );
    } else {
      const dphHevt = new cc.Event.EventCustom("_state_change", true);
      dphHevt.setUserData({ heart: -1 });
      this.node.dispatchEvent(dphHevt);
    }
    this.node.dispatchEvent(evt);
    this.node.dispatchEvent(new cc.Event.EventCustom("_go_next_lv", true));
  },

  pressGetReward() {
    // 获取奖励
    cc.log("pressGetReward");
    this.AudioPlayer.playOnceMusic("coin");
    if (!this.hasShowOnceBannerAd) {
      setTimeout(() => {
        const ad = cc.find("bgm").getComponent("WechatAdService");
        const style = ad.transformPos(this.getRewardNode, {
          width: 400,
          height: 240,
        });
        ad.setGBAd("banner", true, style, () => {
          console.log("added");
        });
        this.hasShowOnceBannerAd = true;
        this.schedule(() => {
          ad.setGBAd("banner", false);
        }, getCfgVal("zs_banner_banner_time", 2000) / 1000);
      }, 1000);
      return;
    }
    this.doubelNode.active = false;
    this.getRewardNode.active = false;
    this.redirectNode.active = true;
    // 取消重玩本关
    // this.replayNode.on("click", this.replayCurrentLevel, this);
    this.goNextNode.on("click", this.goNextLevel, this);

    const dphevt = new cc.Event.EventCustom("_state_change", true);
    const money = this.reward * (this.doubel ? 2 : 1);
    dphevt.setUserData({ money });
    this.node.dispatchEvent(dphevt);
  },

  toggleDoubel(evt) {
    // 勾选双倍
    this.AudioPlayer.playOnceMusic("button");
    this.dispatchGold(evt.isChecked);
  },

  dispatchGold(doubel) {
    const mul = doubel ? 2 : 1;
    this.goldRewardLabel.string = parseInt(this.reward * mul);
    this.doubel = doubel;
  },
});

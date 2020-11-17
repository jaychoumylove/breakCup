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

    reward: cc.Integer,
    doubel: true,
  },

  onLoad() {
    this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
    this.AudioPlayer.playOnceMusic("win");
    this.initBtn();
    this.initReward();
    // 播放动画
    this.initStarAction();
  },

  initStarAction() {
    const { star, current } = JSON.parse(
      cc.sys.localStorage.getItem("currentLevel")
    );
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
    const levels = JSON.parse(localStorage.getItem("userLevel"));
    this.goNextNode.active = current < levels.length;
    this.levelLabel.string = current;
  },

  initBtn() {
    this.getRewardNode.on("click", this.pressGetReward, this);
    this.checkDoubelNode
      .getComponent(cc.Toggle)
      .node.on("toggle", this.toggleDoubel, this);
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
    const evt = new cc.Event.EventCustom("_toggle_loading", true);
    evt.setUserData({ status: true });
    this.node.dispatchEvent(evt);
    this.node.dispatchEvent(new cc.Event.EventCustom("_replay_current", true));
  },

  goNextLevel() {
    this.AudioPlayer.playOnceMusic("button");
    cc.log("go next level");
    if (!this.checkHeart()) {
      return this.node.dispatchEvent(
        new cc.Event.EventCustom("_add_heart", true)
      );
    }
    // 去下一关
    const evt = new cc.Event.EventCustom("_toggle_loading", true);
    evt.setUserData({ status: true });
    this.node.dispatchEvent(evt);
    this.node.dispatchEvent(new cc.Event.EventCustom("_go_next_lv", true));
  },

  pressGetReward() {
    // 获取奖励
    cc.log("pressGetReward");
    this.doubelNode.active = false;
    this.getRewardNode.active = false;
    this.redirectNode.active = true;
    this.AudioPlayer.playOnceMusic("coin");
    this.replayNode.on("click", this.replayCurrentLevel, this);
    this.goNextNode.on("click", this.goNextLevel, this);

    const dphevt = new cc.Event.EventCustom("_state_change", true);
    const money = this.reward * (this.doubel ? 2 : 1);
    dphevt.setUserData({ money });
    const call = () => {
      this.node.dispatchEvent(dphevt);
    };
    if (this.doubel) {
      const ad = cc.find("bgm").getComponent("WechatAdService");
      const res = ad.openVideoWithCb(() => {
        call();
      });
      if (false == res) {
        // 不在微信环境下直接获取奖励
        call();
      }
    } else {
      call();
    }
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

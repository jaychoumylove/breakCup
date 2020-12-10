import { versionCheck, getCfgVal } from "../util/ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    bgNode: cc.Node,
    closeNode: cc.Node,
    progressNode: cc.Node,
    getBtnNode: cc.Node,
    descLabel: cc.Label,
    starGroupNode: cc.Node,
    starFullSprite: cc.SpriteFrame,
    starEmptySprite: cc.SpriteFrame,
  },

  onLoad() {
    this.initTouch();
    this.initBtn();
    this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
    this.node.on("_get_three_star_load", this.dispatchLoad, this);
  },

  initTouch() {
    this.bgNode.on(cc.Node.EventType.TOUCH_START, this.stopDispatch, this);
    this.bgNode.on(cc.Node.EventType.TOUCH_MOVE, this.stopDispatch, this);
    this.bgNode.on(cc.Node.EventType.TOUCH_END, this.stopDispatch, this);
    this.bgNode.on(cc.Node.EventType.TOUCH_CANCEL, this.stopDispatch, this);
  },

  offTouch() {
    this.bgNode.off(cc.Node.EventType.TOUCH_START, this.stopDispatch, this);
    this.bgNode.off(cc.Node.EventType.TOUCH_MOVE, this.stopDispatch, this);
    this.bgNode.off(cc.Node.EventType.TOUCH_END, this.stopDispatch, this);
    this.bgNode.off(cc.Node.EventType.TOUCH_CANCEL, this.stopDispatch, this);
  },

  stopDispatch(evt) {
    evt.stopPropagation();
  },

  initBtn() {
    this.getBtnNode.on("click", this.doubelHandle, this);
    // 取消广告icon
    // this.getBtnNode.getComponent(cc.Button).target.getChildByName('icon').active = false;
  },

  dispatchLoad(evt) {
    const { star } = evt.getUserData();
    if (cc.sys.platform == cc.sys.OPPO_GAME) {
      if (versionCheck()) {
        let time = parseInt(getCfgVal("zs_jump_time"));
        if (time < 1) {
        } else {
          if (time) {
            if (time < 1000) {
              time = time * 1000;
            }
            setTimeout(() => {
              this.closeNode.active = true;
              this.closeNode.on("click", this.closeHandle, this);
            }, time);
          } else {
            this.closeNode.active = true;
            this.closeNode.on("click", this.closeHandle, this);
          }
        }
      } else {
        this.closeNode.active = true;
        this.closeNode.on("click", this.closeHandle, this);
      }
    } else {
      setTimeout(() => {
        this.closeNode.active = true;
        this.closeNode.on("click", this.closeHandle, this);
      }, 2000);
    }
    this.closeTimer = setInterval(() => {
      let progress = this.progressNode.getComponent(cc.ProgressBar).progress;
      if (parseFloat(progress) > 0) {
        this.progressNode.getComponent(cc.ProgressBar).progress =
          parseFloat(progress) - 0.01;
      } else {
        this.goNext();
      }
    }, 100);

    this.starGroupNode.children.map((ite, ind) => {
      if (ind < star) {
        ite.getComponent(cc.Sprite).spriteFrame = this.starFullSprite;
      } else {
        ite.getComponent(cc.Sprite).spriteFrame = this.starEmptySprite;
      }
    });

    this.descLabel.string = this.descLabel.string.replace(/\d/, star);
  },

  goNext() {
    clearInterval(this.closeTimer);
    this.node.dispatchEvent(new cc.Event.EventCustom("_go_settle", true));
  },

  closeHandle(evt) {
    this.AudioPlayer.playOnceMusic("button");
    this.closeNode.active = false;
    this.goNext();
  },

  doubelHandle() {
    this.AudioPlayer.playOnceMusic("button");
    let ad = null;
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      ad = cc.find("bgm").getComponent("WechatAdService");
    }
    if (cc.sys.platform == cc.sys.OPPO_GAME) {
      ad = cc.find("bgm").getComponent("OppoAdService");
    }
    const call = () => {
      this.recordLevelThreeStar();
      this.goNext();
    };
    if (!ad) {
      // 不在微信环境下直接获取奖励
      call();
      return;
    }
    ad.openVideoWithCb(() => {
      call();
    });
  },

  recordLevelThreeStar() {
    const evt = new cc.Event.EventCustom("_record_lv_star", true);
    evt.setUserData({ star: 3 });
    this.node.dispatchEvent(evt);
  },
});

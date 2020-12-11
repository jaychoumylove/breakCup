import { isOppo } from "../util/common";
import { getCfgVal, versionCheck } from "../util/ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    closeBtn: cc.Node,
    getRewardBtn: cc.Node,

    containerNode: cc.Node,

    addType: cc.String,
    addNumber: cc.Integer,
  },

  onLoad() {
    this.getRewardBtn.on("click", this.handleGetReward, this);
    this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
    this.node.on("_dispatch_add_load", this.dispatchLoad, this);

    // 取消广告icon
    // this.getRewardBtn.getComponent(cc.Button).target.getChildByName('icon').active = false;
  },

  handleGetReward(evt) {
    this.AudioPlayer.playOnceMusic("button");
    cc.log("press get reward");
    let ad = null;
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      ad = cc.find("bgm").getComponent("WechatAdService");
    }
    if (isOppo()) {
      ad = cc.find("bgm").getComponent("OppoAdService");
    }
    const call = () => {
      const dphevt = new cc.Event.EventCustom("_state_change", true);
      dphevt.setUserData({ [this.addType]: this.addNumber });
      this.node.dispatchEvent(dphevt);
      this.closeContainer();
    };

    if (!ad) {
      call();
      return;
    }

    ad.openVideoWithCb(() => {
      call();
    });
  },

  dispatchLoad(evt) {
    const { node } = evt.getUserData();
    this.containerNode = node;
    if (isOppo()) {
      if (versionCheck()) {
        let time = parseInt(getCfgVal("zs_jump_time"));
        if (time < 1) {
          this.closeBtn.active = true;
          this.closeBtn.on("click", this.handleClose, this);
        } else {
          if (time) {
            if (time < 1000) {
              time = time * 1000;
            }
            setTimeout(() => {
              this.closeBtn.active = true;
              this.closeBtn.on("click", this.handleClose, this);
            }, time);
          } else {
            this.closeBtn.active = true;
            this.closeBtn.on("click", this.handleClose, this);
          }
        }
      } else {
        this.closeBtn.active = true;
        this.closeBtn.on("click", this.handleClose, this);
      }
    } else {
      setTimeout(() => {
        this.closeBtn.active = true;
        this.closeBtn.on("click", this.handleClose, this);
      }, 2000);
    }
  },

  handleClose(evt) {
    this.AudioPlayer.playOnceMusic("button");
    this.closeContainer();
  },

  closeContainer() {
    this.closeBtn.active = false;
    this.node.active = false;
    this.containerNode.active = false;
  },
});

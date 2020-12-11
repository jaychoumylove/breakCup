import { isOppo } from "../util/common";
import { versionCheck, getCfgVal, getOpenStatus } from "../util/ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    pauseBtnGroup: cc.Node,
    failBtnGroup: cc.Node,

    playBtn: cc.Button,
    replayBtn: cc.Button,

    musicOnSpriteFrame: cc.SpriteFrame,
    musicOFFSpriteFrame: cc.SpriteFrame,
    bgmOnSpriteFrame: cc.SpriteFrame,
    bgmOFFSpriteFrame: cc.SpriteFrame,
  },

  onLoad() {
    this.initPress();
    this.initTouch();
    this.initScreen();
    this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
    const localStorage = cc.sys.localStorage;
    const { current } = JSON.parse(localStorage.getItem("currentLevel"));
    cc
      .find("current Level/number", this.node)
      .getComponent(cc.Label).string = current;
  },

  update() {
    const volume = JSON.parse(cc.sys.localStorage.getItem("userVolume"));
    const bgSprite = volume.bg ? this.bgmOnSpriteFrame : this.bgmOFFSpriteFrame;
    if (
      this.bgmNode.getComponent(cc.Button).target.getComponent(cc.Sprite)
        .spriteFrame != bgSprite
    ) {
      this.bgmNode
        .getComponent(cc.Button)
        .target.getComponent(cc.Sprite).spriteFrame = bgSprite;
    }
    const musicSprite = volume.once
      ? this.musicOnSpriteFrame
      : this.musicOFFSpriteFrame;
    if (
      this.musicNode.getComponent(cc.Button).target.getComponent(cc.Sprite)
        .spriteFrame != musicSprite
    ) {
      this.musicNode
        .getComponent(cc.Button)
        .target.getComponent(cc.Sprite).spriteFrame = musicSprite;
    }
  },

  onDestroy() {
    this.offTouch();
  },

  initTouch() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.stopDispatch, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.stopDispatch, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.stopDispatch, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.stopDispatch, this);
  },

  offTouch() {
    this.node.off(cc.Node.EventType.TOUCH_START, this.stopDispatch, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.stopDispatch, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.stopDispatch, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.stopDispatch, this);
  },

  stopDispatch(evt) {
    evt.stopPropagation();
  },

  pressPlay() {
    this.AudioPlayer.playOnceMusic("button");
    this.pauseBtnGroup.active = false;
    this.node.active = false;
    // this.offPress();
  },

  initPress() {
    this.playBtn.node.on("click", this.pressPlay, this);
    let call = () => {
      this.replayBtn.node.on("click", this.pressReplay, this);
    };
    if (
      isOppo() &&
      versionCheck() &&
      !getOpenStatus() &&
      parseInt(getCfgVal("zs_native_limit"))
    ) {
      if (parseInt(getCfgVal("zs_jump_time"))) {
        let time = parseInt(getCfgVal("zs_jump_time"));
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
        call();
      }
    } else {
      call();
    }
    this.bgmNode = this.pauseBtnGroup.getChildByName("bgm");
    this.musicNode = this.pauseBtnGroup.getChildByName("music");
    this.bgmNode.on("click", this.pressBGM, this);
    this.musicNode.on("click", this.pressMusic, this);
    // this.pauseButton.node.on('click', this.pressPause, this);
  },

  offPress() {
    this.playBtn.node.off("click", this.pressPlay, this);
    // this.pauseButton.node.off('click', this.pressPause, this);
  },

  initScreen() {
    this.node.on("_pause", this.dispatchPauseScreen, this);
    this.node.on("_fail", this.dispatchFailScreen, this);
  },

  dispatchPauseScreen(evt) {
    this.failBtnGroup.active = false;
    this.pauseBtnGroup.active = true;
  },

  dispatchFailScreen(evt) {
    this.pauseBtnGroup.active = false;
    this.failBtnGroup.active = true;
  },

  pressReplay() {
    this.AudioPlayer.playOnceMusic("button");
    const evt = new cc.Event.EventCustom("_toggle_loading", true);
    evt.setUserData({ status: true });
    this.node.dispatchEvent(evt);
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      if (versionCheck()) {
        cc.resources.load(
          "prefab/openOneVertical",
          cc.Prefab,
          (err, prefab) => {
            cc.log(err, prefab);
            if (!err) {
              const openNode = cc.instantiate(prefab);
              openNode.getComponent("OpenOneFullAd").callBK = () => {
                this.node.dispatchEvent(
                  new cc.Event.EventCustom("_replay_current", true)
                );
              };
              cc.find("Canvas").addChild(openNode);
            }
          }
        );
        return;
      }
    }

    if (isOppo()) {
      const nativeAd = cc.find("Canvas/SingleNativeAd");
      if (nativeAd) {
        nativeAd.destroy();
      }
    }

    this.node.dispatchEvent(new cc.Event.EventCustom("_replay_current", true));
  },

  pressBGM() {
    this.AudioPlayer.checkBgMusicStatus(
      this.bgmNode.getComponent(cc.Button).target.getComponent(cc.Sprite)
        .spriteFrame != this.bgmOnSpriteFrame
    );
  },

  pressMusic() {
    this.AudioPlayer.checkOnceMusicStatus(
      this.musicNode.getComponent(cc.Button).target.getComponent(cc.Sprite)
        .spriteFrame != this.musicOnSpriteFrame
    );
  },
});

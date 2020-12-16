import zsSdk from "zs.sdk";
import { isWechat } from "../common";
import { getCfgVal, getSysVal, getImageByKey } from "../ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    openOne: cc.Prefab,
    indexLabel: cc.Label,
    txt_name: cc.Label,
    icon: cc.Sprite,
    spriteSize: cc.Vec2,
    adEntity: null,
  },

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_END, this.navigate2Mini, this);
  },

  onDestroy() {
    this.node.off(cc.Node.EventType.TOUCH_END, this.navigate2Mini, this);
  },

  init(adEntity, adIndex) {
    this.adEntity = adEntity;
    if (this.txt_name) {
      this.txt_name.string = adEntity.app_title;
    }
    if (this.indexLabel) {
      if (typeof adIndex == "number" && adIndex > -1) {
        let floor = adIndex > 0 ? adIndex : 0;
        const randBg = floor + 1;
        this.indexLabel.string = randBg;
      }
    }
    if (this.descLabel) {
      if (typeof adIndex == "number" && adIndex > -1) {
        let floor = adIndex > 0 ? adIndex : 0;
        const randBg = floor + 1;
        let peopleNum = 20;
      }
    }

    if (adEntity.app_icon) {
      getImageByKey(adEntity.app_icon, (spriteFrame) => {
        this.icon.spriteFrame = spriteFrame;
        this.icon.node.width = this.spriteSize.x;
        this.icon.node.height = this.spriteSize.y;
      });
    }
  },

  navigate2Mini() {
    console.log(
      "==================",
      "点击",
      this.adEntity.app_title,
      "======================"
    );
    //微信openid
    let openid = getSysVal("zsUser");
    console.info(openid);

    let success = () => {
      //成功回调
      console.log("成功");
    };

    let fail = () => {
      //失败回调
      console.log("失败");
      if (isWechat()) {
        if (!cc.find("Canvas/openOne")) {
          if (cc.find("Canvas/openThree") || cc.find("Canvas/openThree")) {
            return;
          }
          if (parseInt(getCfgVal("zs_full_screen_jump"))) {
            const ad = cc.find("bgm").getComponent("WechatAdService");
            ad.setGBAd("banner", false);
            cc.find("Canvas").addChild(cc.instantiate(this.openOne));
          }
        }
      }
    };

    let complete = () => {
      //不管成功或失败都会调用
      console.log("complete 不管成功或失败都会调用");
    };

    zsSdk.navigate2Mini(this.adEntity, openid, success, fail, complete);
  },
});

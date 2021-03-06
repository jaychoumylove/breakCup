import zsSdk from "zs.sdk";
import { isWechat } from "../common";
import { getCfgVal, getSysVal } from "../ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    openOne: cc.Prefab,
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

  init(adEntity) {
    this.adEntity = adEntity;
    if (this.txt_name) {
      this.txt_name.string = adEntity.app_title;
    }

    if (adEntity.app_icon) {
      if (typeof adEntity.app_icon == "string") {
        cc.assetManager.loadRemote(
          adEntity.app_icon,
          { ext: ".png" },
          (err, texture) => {
            if (texture) {
              var spriteFrame = new cc.SpriteFrame(texture);
              if (this.icon && spriteFrame) {
                this.icon.spriteFrame = spriteFrame;
                this.icon.node.width = this.spriteSize.x;
                this.icon.node.height = this.spriteSize.y;
              }
            }
          }
        );
      }

      if (adEntity.app_icon instanceof cc.SpriteFrame) {
        this.icon.spriteFrame = adEntity.app_icon;
        this.icon.node.width = this.spriteSize.x;
        this.icon.node.height = this.spriteSize.y;
      }
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
            if (this.node.parent.parent.parent.name == "bg") {
              return;
            }
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

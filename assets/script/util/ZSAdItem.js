import zsSdk from "zs.sdk";
import { getCfgVal, getSysVal } from "./ZSLoad";
import { randomIntFromInterval } from "./common";

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
    // ע�᷽��
    this.node.on(cc.Node.EventType.TOUCH_END, this.navigate2Mini, this);
  },

  onDestroy() {
    //ȡ��ע��
    this.node.off(cc.Node.EventType.TOUCH_END, this.navigate2Mini, this);
  },

  /**
   * app_title ��Ϸ����
   * app_icon ��Ϸicon��ַ
   */
  init(adEntity, adIndex) {
    const _this = this;
    _this.adEntity = adEntity;
    if (_this.txt_name) {
      _this.txt_name.string = adEntity.app_title;
      if (typeof adIndex == "number" && adIndex > -1) {
        if (
          _this.txt_name.node.parent != _this.node &&
          _this.txt_name.node.parent.getChildByName("bg")
        ) {
          const absolutePath = "image/util/openOneAssets/";
          let floor = adIndex > 0 ? adIndex % 9 : 0;
          const randBg = floor + 1;
          cc.resources.load(
            absolutePath + randBg,
            cc.SpriteFrame,
            null,
            (e, df) => {
              if (!e) {
                _this.txt_name.node.parent
                  .getChildByName("bg")
                  .getComponent(cc.Sprite).spriteFrame = df;
              }
            }
          );
        }
      }
    }

    if (adEntity.app_icon) {
      if (typeof adEntity.app_icon == "string") {
        // console.log("从url加载", adEntity.app_icon);
        cc.assetManager.loadRemote(adEntity.app_icon, (err, img) => {
          // console.log("加载over:");
          // console.log("erro texture");
          // console.log(err, img);
          if (img) {
            var spriteFrame = new cc.SpriteFrame(img);
            // console.log("spriteFrame");
            // console.log(spriteFrame);
            if (_this.icon && spriteFrame) {
              // _this.icon.node.getComponent(
              //   cc.Sprite
              // ).spriteFrame = spriteFrame;
              _this.icon.spriteFrame = spriteFrame;
              _this.icon.node.width = _this.spriteSize.x;
              _this.icon.node.height = _this.spriteSize.y;
              // console.log("icon");
              // console.log(_this.icon);
            }
          }
        });
        // cc.loader.load(
        //   { url: adEntity.app_icon, type: "png" },
        //   (err, texture) => {
        //     console.log("加载over:");
        //     console.log("erro texture");
        //     console.log(err, texture);
        //     if (texture) {
        //       var spriteFrame = new cc.SpriteFrame(texture);
        //       console.log("spriteFrame");
        //       console.log(spriteFrame);
        //       if (_this.icon && spriteFrame) {
        //         _this.icon.spriteFrame = spriteFrame;
        //         _this.icon.node.width = _this.spriteSize.x;
        //         _this.icon.node.height = _this.spriteSize.y;
        //         console.log("icon");
        //         console.log(_this.icon);
        //       }
        //     }
        //   }
        // );
      }

      if (adEntity.app_icon instanceof cc.SpriteFrame) {
        _this.icon.spriteFrame = adEntity.app_icon;
        _this.icon.node.width = _this.spriteSize.x;
        _this.icon.node.height = _this.spriteSize.y;
      }
    }
  },

  //�����ת��������button �������
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
      if (!cc.find("Canvas/openOneVertical")) {
        cc.find("Canvas").addChild(cc.instantiate(this.openOne));
        // if (parseInt(getCfgVal("zs_full_screen_jump"))) {
        //   if (this.node.parent.parent.parent.name == "bg") {
        //     return;
        //   }
        //   cc.find("Canvas").addChild(cc.instantiate(this.openOne));
        // }
      }
    };

    let complete = () => {
      //不管成功或失败都会调用
      console.log("complete 不管成功或失败都会调用");
    };

    zsSdk.navigate2Mini(this.adEntity, openid, success, fail, complete);
  },
});

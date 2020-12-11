import zsSdk from "zs.sdk";
import { getSysVal, getImageByKey } from "./ZSLoad";

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
    this.adEntity = adEntity;
    if (this.txt_name) {
      this.txt_name.string = adEntity.app_title;
      if (typeof adIndex == "number" && adIndex > -1) {
        if (
          this.txt_name.node.parent != this.node &&
          this.txt_name.node.parent.getChildByName("bg")
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
                this.txt_name.node.parent
                  .getChildByName("bg")
                  .getComponent(cc.Sprite).spriteFrame = df;
              }
            }
          );
        }
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

      if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        if (!cc.find("Canvas/openOneVertical")) {
          if (cc.find("Canvas/openThree") || cc.find("Canvas/openThree")) {
            return;
          }
          const ad = cc.find("bgm").getComponent("WechatAdService");
          ad.setGBAd("banner", false);
          cc.find("Canvas").addChild(cc.instantiate(this.openOne));
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

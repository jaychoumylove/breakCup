import zsSdk from "zs.sdk";
import { shuffleArray } from "./common";
import zsLoad from "./ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    itemPrefab: cc.Prefab,
    adParent: cc.Node,
    scrollDirect: cc.Vec2,
  },

  onLoad() {
    if (zsLoad.versionCheck()) {
      this.refreshAds();
    }
  },

  refreshAds() {
    zsLoad.loadgetZsLoadDataAd((res) => {
      this.showAd(res);
    });
  },

  showAd(adData) {
    //��ȡ��������Ĺ�����ݣ���������ҳ�ײ��Ĺ������Ϊ��
    let adArray = adData.promotion;
    // 打乱数组
    adArray = shuffleArray(adArray);

    if (adArray.length > 0) {
      //���������ݴ���0��
      for (let i = 0; i < adArray.length; i++) {
        //Ҫչʾ�������i
        const adEntity = adArray[i];
        //����icon���ڵ�
        let adNode = cc.instantiate(this.itemPrefab);
        // ���ӵ���游�ڵ�
        this.adParent.addChild(adNode);
        //��ȡAdItem
        let adItem = adNode.getComponent("ZSAdItem");
        if (adItem) {
          //�������ʼ��
          adItem.init(adEntity);
        }
      }
    }

    if (this.scrollDirect) {
      const defaultPos = { x: this.adParent.x, y: this.adParent.y };
      const activePos = { x: this.adParent.x, y: this.adParent.y };
      const itemW =
        this.itemPrefab.data.width +
        this.adParent.getComponent(cc.Layout).spacingX;
      const itemH =
        this.itemPrefab.data.height +
        this.adParent.getComponent(cc.Layout).spacingY;
      if (this.scrollDirect.x) {
        const maxX = adArray.length * itemW - this.adParent.parent.width;
        activePos.x = maxX * this.scrollDirect.x;
      }

      if (this.scrollDirect.y) {
        const maxY = adArray.length * itemH - this.adParent.parent.height;
        activePos.y = maxY * this.scrollDirect.y;
      }

      let up = cc.tween().to(10, activePos),
        down = cc.tween().to(10, defaultPos),
        action = cc.tween().then(up).then(down);
      cc.tween(this.adParent).repeatForever(action).start();
    }
  },
});

import { initAD } from "../util/wechatAd";
import { versionCheck } from "../util/ZSLoad";

cc.Class({
  extends: cc.Component,

  properties: {
    heart: cc.Integer,
    money: cc.Integer,
    lastAddHeartTime: cc.Integer,
    maxLevel: cc.Integer,

    scrollPrefab: cc.Prefab,
    moreGameNode: cc.Node,
    drawNode: cc.Prefab,
    darkScreen: cc.Prefab,
  },

  onLoad() {
    // 初始化数据
    const userData = {
      heart: this.heart,
      money: this.money,
      lastAddHeartTime: this.lastAddHeartTime,
    };
    this.initByStorage("userState", userData);
    let level = [];
    for (let index = 0; index < this.maxLevel; index++) {
      const item = {
        level: index + 1,
        lock: index > 0,
        star: 0,
      };
      level.push(item);
    }

    this.initByStorage("userLevel", level);

    this.initAd();
  },

  initAd() {
    if (versionCheck()) {
      const parent = cc.find("Canvas/Main Camera");
      const crollNode = cc.instantiate(this.scrollPrefab);
      crollNode.y = 252.539;
      if (this.drawNode) {
        const darkNode = cc.instantiate(this.darkScreen);
        parent.addChild(darkNode);
        const drawNode = cc.instantiate(this.drawNode);
        parent.addChild(drawNode);
        drawNode.getComponent("drawAd").darkScreen = darkNode;
        // this.drawNode.active = true;
      }
      parent.addChild(crollNode);
      this.moreGameNode.active = true;
    } else {
      if (this.drawNode) {
        // this.drawNode.active = false;
      }
      this.moreGameNode.active = false;
    }
  },

  start() {
    if (versionCheck()) {
      const ad = cc.find("bgm").getComponent("WechatAdService");
      ad.setGBAd(
        "banner",
        true,
        {
          width: 300,
          height: 100,
          pos: "middleBottom",
        },
        () => {
          console.log("added");
        }
      );
    }
  },

  onDestroy() {
    // const ad = cc.find("bgm").getComponent("WechatAdService");
    // ad.setGBAd("banner", false);
  },

  initByStorage(key, dftValue) {
    const localStorage = cc.sys.localStorage;
    let userData = localStorage.getItem(key);
    if (!userData) {
      localStorage.setItem(key, JSON.stringify(dftValue));
      return;
    }
    if (key == "userLevel") {
      userData = JSON.parse(userData);
      if (userData instanceof Array && userData.length < dftValue.length) {
        let lastInd = 0;
        const newUserData = dftValue.map((ite, ind) => {
          if (userData.hasOwnProperty(ind)) {
            lastInd = ind;
            return userData[ind];
          } else {
            if (lastInd == ind) {
              ite.lock = false;
            }
            return ite;
          }
        });

        localStorage.setItem(key, JSON.stringify(newUserData));
      }
    }
  },
});

import { initSkinGroup } from "../public/UserSkin";
import { isOppo } from "../util/common";
import { versionCheck, getCfgVal, getOpenStatus } from "../util/ZSLoad";

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
    let newGuy = !cc.sys.localStorage.getItem("userState");
    this.initByStorage("userState", userData);
    initSkinGroup();
    this.initByStorage("userSkin", {
      has: [0],
      use: 0,
    });
    let level = [];
    for (let index = 0; index < this.maxLevel; index++) {
      const item = {
        level: index + 1,
        lock: index > 0,
        star: 0,
      };
      level.push(item);
    }

    cc.director.preloadScene("level");

    this.initByStorage("userLevel", level);

    this.initAd(newGuy);
  },

  initAd(newGuy) {
    this.moreGameNode.active = false;
    if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
      return;
    }
    if (versionCheck()) {
      const parent = cc.find("Canvas/Main Camera");
      let crollNode = null;
      if (
        cc.sys.platform == cc.sys.WECHAT_GAME &&
        parseInt(getCfgVal("zs_jump_switch"))
      ) {
        crollNode = cc.instantiate(this.scrollPrefab);
        crollNode.y = 252.539;
      }
      const oneFreeAd = cc.find("bg container/oppoOneFree", parent);
      oneFreeAd.active = false;
      if (isOppo() && parseInt(getCfgVal("zs_jump_switch"))) {
        oneFreeAd.active = true;
        if (this.drawNode) {
          const darkNode = cc.instantiate(this.darkScreen);
          parent.addChild(darkNode);
          const drawNode = cc.instantiate(this.drawNode);
          parent.addChild(drawNode);
          drawNode.getComponent("drawAd").changeSprite(newGuy, true);
          drawNode.getComponent("drawAd").darkScreen = darkNode;
        }
      }
      if (
        cc.sys.platform == cc.sys.WECHAT_GAME &&
        parseInt(getCfgVal("zs_jump_switch"))
      ) {
        if (this.drawNode) {
          const darkNode = cc.instantiate(this.darkScreen);
          parent.addChild(darkNode);
          const drawNode = cc.instantiate(this.drawNode);
          parent.addChild(drawNode);
          drawNode.getComponent("drawAd").changeSprite(newGuy, true);
          drawNode.getComponent("drawAd").darkScreen = darkNode;
        }
        parent.addChild(crollNode);
        this.moreGameNode.active = true;
      }
    } else {
      if (this.drawNode) {
        // this.drawNode.active = false;
      }
    }
  },

  start() {
    if (versionCheck()) {
      let ad = null,
        style;
      if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        ad = cc.find("bgm").getComponent("WechatAdService");
        style = {
          width: 300,
          height: 100,
          pos: "middleBottom",
        };
      }
      console.log(getOpenStatus());
      if (isOppo() && !getOpenStatus()) {
        ad = cc.find("bgm").getComponent("OppoAdService");
        style = {
          width: 900,
          height: 300,
          pos: "middleBottom",
        };
      }
      if (ad) {
        ad.setGBAd("banner", true, style, () => {
          console.log("added");
        });
      }
    }
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

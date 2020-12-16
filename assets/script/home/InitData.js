import { initAddTimer } from "../public/UserHeart";
import { initSkinGroup } from "../public/UserSkin";

cc.Class({
  extends: cc.Component,

  properties: {
    heart: 5,
    money: 0,
    maxLevel: 18,
  },

  onLoad() {
    // 初始化数据
    const userData = {
      heart: this.heart,
      money: this.money,
      lastAddHeartTime: this.lastAddHeartTime,
    };
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

    this.initByStorage("userLevel", level);
    initAddTimer();
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

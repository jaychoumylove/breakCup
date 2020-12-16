import zsSdk from "zs.sdk";
import cfg from "./cfg";
import { isOppo, isWechat } from "./common";

let loadedData = { promotion: [] };
let imageDict = {};
let openTime = 0; // 用于开局一分钟之内禁止弹广告

const setOpenTimer = () => {
  openTime = Math.floor(Date.now() / 1000) + 60;
};

const getOpenStatus = () => {
  console.log("now, opentime");
  console.log(Math.floor(Date.now() / 1000));
  console.log(openTime);
  // 是否在开局禁止广告时间内 true 是 不显示广告 false 否 显示广告
  if (openTime < 1) return false;

  return Math.floor(Date.now() / 1000) <= openTime;
};

const setLoadedData = (data) => {
  loadedData = data;
};

const setImageKV = (k, v) => {
  imageDict[k] = v;
};

const getImageByKey = (k, call) => {
  if (imageDict.hasOwnProperty(k)) {
    const spriteFrame = new cc.SpriteFrame(imageDict[k]);
    call && call(spriteFrame);
    return;
  }

  loadRemoteImage(k, call);
  return;
};

const loadRemoteImage = (url, call) => {
  cc.assetManager.loadRemote(url, { ext: ".png" }, (err, texture) => {
    if (texture) {
      setImageKV(url, texture);
      const spriteFrame = new cc.SpriteFrame(texture);
      call && call(spriteFrame);
    }
  });
};

const zsLoad = (call) => {
  const loadMap = [
    cc.sys.WECHAT_GAME,
    cc.sys.OPPO_GAME,
    cc.sys.VIVO_GAME,
    cc.sys.QQ_PLAY,
  ];
  if (loadMap.indexOf(cc.sys.platform) > -1) {
    console.log("zsSdk.loadCfg");
    zsSdk.loadCfg((data) => {
      cc.sys.localStorage.setItem("zsCfg", JSON.stringify(data));
      if (isOppo()) {
        if (
          data.hasOwnProperty("zs_onemin_show_ad_switch") &&
          parseInt(data.zs_onemin_show_ad_switch) > 0
        ) {
          setOpenTimer();
        }
      }
    });
    call && call();
  } else {
    // call && call();
    // return;
    zsSdk.loadCfg((data) => {
      cc.sys.localStorage.setItem("zsCfg", JSON.stringify(data));
      call && call();
    });
  }
  //wx, oppo, vivo, tt, qq
  const map = [
    cc.sys.WECHAT_GAME,
    // cc.sys.OPPO_GAME,
    // cc.sys.VIVO_GAME,
    cc.sys.QQ_PLAY,
  ];
  if (map.indexOf(cc.sys.platform) > -1) {
    zsSdk.login((user_id) => {
      cc.sys.localStorage.setItem("zsUser", user_id);
      zsSdk.init(user_id);
    });
  }
};

const getCfgVal = (key, dft) => {
  if (!dft) dft = false;
  const zsCfgStr = cc.sys.localStorage.getItem("zsCfg");
  if (!zsCfgStr) return dft;

  if (!isJsonString(zsCfgStr)) return dft;

  const zsCfg = JSON.parse(zsCfgStr);
  if (zsCfg.hasOwnProperty(key) == false) {
    return dft;
  }

  return zsCfg[key];
};

const getSysVal = (key, dft) => {
  if (!dft) dft = false;
  const zsCfgStr = cc.sys.localStorage.getItem(key);
  if (!zsCfgStr) return dft;

  return isJsonString(zsCfgStr) ? JSON.parse(zsCfgStr) : zsCfgStr;
};

const getZsLoadData = (call) => {
  if (isOppo() || isWechat()) {
    zsSdk.loadAd((res) => {
      call(res);
    });
  } else {
    call(loadedData);
  }
};

const setZsLoadData = (call) => {
  zsSdk.loadAd((res) => {
    const adArray = res.promotion;
    if (!adArray.length) {
      return;
    }
    setLoadedData(res);
    for (let i = 0; i < adArray.length; i++) {
      let adEntity = adArray[i];
      cc.assetManager.loadRemote(
        adEntity.app_icon,
        { ext: ".png" },
        (err, texture) => {
          if (texture) {
            setImageKV(adEntity.app_icon, texture);
          }
          if (i + 1 == adArray.length) {
            call && call();
          }
        }
      );
    }
  });
  call && call();
};

const initZsData = (call) => {
  setZsLoadData(call);
  setInterval(() => {
    isOppo() || isWechat() ? console.log(loadedData) : setZsLoadData(null);
  }, 1000 * 30);
};

const isJsonString = (str) => {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
};

const versionCheck = () => {
  // 最初版本1.1.0
  // return false;
  // return true;
  if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    return !(getCfgVal("zs_version", "1.1.0") == cfg.version);
  }
  if (isOppo()) {
    return getCfgVal("zs_version", "1.0") == cfg.version;
  }
  if (cc.sys.platform == cc.sys.VIVO_GAME) {
    return getCfgVal("zs_version", "1.0") == cfg.version;
  }

  // 默认
  return !(getCfgVal("zs_version", "1.0") == cfg.version);
};

module.exports = {
  zsLoad,
  initZsData,
  getZsLoadData,
  getCfgVal,
  getSysVal,
  versionCheck,
  loadRemoteImage,
  getImageByKey,
  getOpenStatus,
};

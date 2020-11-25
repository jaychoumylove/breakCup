import zsSdk from "zs.sdk";
import cfg from "./cfg";

let loadedData = null;
let imageDict = {};

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
  zsSdk.loadCfg((data) => {
    cc.sys.localStorage.setItem("zsCfg", JSON.stringify(data));
    call && call();
  });
  // zsSdk.login((user_id) => {
  //   cc.sys.localStorage.setItem("zsUser", user_id);
  //   zsSdk.init(user_id);
  // });
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
  call(loadedData);
};

const setZsLoadData = (call) => {
  zsSdk.loadAd((res) => {
    setLoadedData(res);
    const adArray = res.promotion;
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
};

const initZsData = (call) => {
  cc.log("call");
  setZsLoadData(call);
  setInterval(() => {
    cc.log("call null");
    setZsLoadData(null);
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
  return !(getCfgVal("zs_version", "1.1.0") == cfg.version);
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
};

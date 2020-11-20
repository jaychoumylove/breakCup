import zsSdk from "zs.sdk";
import cfg from "./cfg";

const zsLoad = (call) => {
  // zsSdk.login((user_id) => {
  //   cc.sys.localStorage.setItem("zsUser", user_id);
  //   zsSdk.init(user_id);
  // });
  zsSdk.loadCfg((data) => {
    cc.sys.localStorage.setItem("zsCfg", JSON.stringify(data));
    // cc.director.loadScene("MainMenu");
    call && call();
  });
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
  const zsad = cc.sys.localStorage.getItem("zsAdArray");
  call(JSON.parse(zsad));
};

const setZsLoadData = () => {
  zsSdk.loadAd((res) => {
    // const adArray = res.promotion;
    // for (let i = 0; i < adArray.length; i++) {
    //   let adEntity = adArray[i];
    //   cc.loader.load(
    //     { url: adEntity.app_icon, type: "png" },
    //     (err, texture) => {
    //       if (texture) {
    //         adArray[i].app_icon = new cc.SpriteFrame(texture);
    //       }
    //       if (i + 1 == adArray.length) {
    //         res.promotion = adArray;
    //         cc.sys.localStorage.setItem("zsAdArray", JSON.stringify(res));
    //       }
    //     }
    //   );
    // }
    cc.sys.localStorage.setItem("zsAdArray", JSON.stringify(res));
  });
};

const initZsData = () => {
  setZsLoadData();
  setInterval(() => {
    setZsLoadData();
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
  return !(getCfgVal("zs_version", "1.1.0") == cfg.version);
};

module.exports = {
  zsLoad,
  initZsData,
  getZsLoadData,
  getCfgVal,
  getSysVal,
  versionCheck,
};

cc.Class({
  extends: cc.Component,
  onLoad() {
    cc.director.preloadScene(
      "level",
      () => {},
      () => {
        console.log("loadedLevel");
      }
    );
    cc.director.preloadScene(
      "home",
      () => {},
      () => {
        console.log("loadedhome");
      }
    );
    this.preLoadAllLevelScene();
  },

  preLoadAllLevelScene() {
    const list = JSON.parse(cc.sys.localStorage.getItem("userLevel"));
    list.map((lvInfo) => {
      if (!lvInfo.lock) {
        cc.director.preloadScene(
          `level_${lvInfo.level}`,
          (loadNumber, allNumber) => {
            // console.log(
            //   "loading " +
            //     `level_${lvInfo.level} ${loadNumber} /  ${allNumber}`
            // );
          },
          () => {
            console.log("loaded " + `level_${lvInfo.level}`);
          }
        );
      }
    });
  },
});

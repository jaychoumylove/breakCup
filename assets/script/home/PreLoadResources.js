cc.Class({
  extends: cc.Component,
  onLoad() {
    const loadArr = ["image", "prefab", "music"];
    loadArr.map((item) => {
      cc.resources.preloadDir(
        item,
        (finish, total, item) => {
          // console.log(finish);
          // console.log(total);
          // console.log(item);
        },
        (error, complete) => {
          console.log(error);
          console.log(complete);
        }
      );
    });
  },
});

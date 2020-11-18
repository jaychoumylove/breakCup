const common = {
  preloadlevel: (level) => {
    cc.director.preloadScene(`level_${level}`);
  },

  shuffleArray(array) {
    var m = array.length,
      t,
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  },

  /**
   * 获取长度为length的随机数
   * @param {number} length
   */
  getRandNumber(length) {
    if (!length) return 0;

    let key = "",
      rand;
    while (key.toString().length < length) {
      rand = Math.round(Math.random() * 10);
      if (rand == 10) continue;
      if (length > 1 && rand == 0 && key.toString().length < 1) continue;
      key += rand.toString();
    }
    return parseInt(key);
  },
};

module.exports = common;

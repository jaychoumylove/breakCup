const common = {
  preloadlevel: (level) => {
    cc.director.preloadScene(`level_${level}`);
  },
};

module.exports = common;

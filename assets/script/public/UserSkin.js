const item = [
  {
    type: "ball",
    sprite: "1",
  },
  {
    type: "triangle",
    sprite: "2",
  },
  {
    type: "four_side",
    sprite: "3",
  },
  {
    type: "ball",
    sprite: "4",
  },
  {
    type: "triangle",
    sprite: "5",
  },
  {
    type: "four_side",
    sprite: "6",
  },
];

let ballMap = [];

const max = 2;

const initSkinGroup = (length) => {
  if (!length) length = max;
  for (let index = 0; index < max; index++) {
    ballMap.push(item);
  }
};

const ballMapPath = "image/base/ball/";

let currentIndex = 0;
let nextIndex = 0;

const getUseSkinGroup = () => {
  const group = cc.sys.localStorage.getItem("userSkin");
  return JSON.parse(group).use;
};

const getNextBall = (length) => {
  let items = [];
  let newCurrent = currentIndex;
  const useBall = getUseSkinGroup();
  const balls = ballMap[useBall];
  for (let index = 0; index < length; index++) {
    newCurrent++;
    if (newCurrent >= balls.length) {
      newCurrent = 0;
    }
    items.push(balls[newCurrent]);
  }

  nextIndex = newCurrent;

  return items;
};

const updateCurrentIndex = () => {
  currentIndex = nextIndex;
};

const getBallMapPath = () => {
  return ballMapPath;
};

module.exports = {
  getNextBall,
  getUseSkinGroup,
  updateCurrentIndex,
  getBallMapPath,
  initSkinGroup,
  ballMap,
};

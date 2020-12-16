export const UserKey = "userState";

const resetHeart = 59;
const maxHeart = 5;

let addTime = resetHeart;
let addTimer = null;

export const getAddTime = () => {
  return addTime;
};

const decreaseAddtime = () => {
  addTime--;
};

const resetAddTime = () => {
  addTime = -1;
};

export const setHeartAddTime = (diff) => {
  addTime = diff * 60 - 1;
};

export const addHeartAddTime = () => {
  addTime += 60;
};

export const initAddTimer = () => {
  if (!addTimer) {
    const diff = maxHeart - getUserHeart();
    if (diff > 0) {
      setHeartAddTime(diff);
    }
    addTimer = setInterval(() => {
      if (getUserHeart() >= maxHeart) {
        if (getAddTime() <= resetHeart) {
          resetAddTime();
        }
      } else {
        if (getAddTime() < 0) {
          const diff = maxHeart - getUserHeart();
          if (diff > 0) {
            setHeartAddTime(maxHeart - getUserHeart());
          }
        } else {
          let s = Math.floor((getAddTime() % (3600 * 24)) % 60);
          if (s > 0) {
            decreaseAddtime();
          } else {
            // 体力加一
            increaseHeart();
            resetAddTime();
          }
        }
      }
    }, 1000);
  }
};

export const getUserHeart = () => {
  const localStorage = cc.sys.localStorage;
  let state = JSON.parse(localStorage.getItem("userState"));
  return state.heart;
};

const increaseHeart = () => {
  const localStorage = cc.sys.localStorage;
  let state = JSON.parse(localStorage.getItem("userState"));
  state.heart++;
  localStorage.setItem("userState", JSON.stringify(state));
};

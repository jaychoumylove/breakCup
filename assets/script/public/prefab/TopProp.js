cc.Class({
  extends: cc.Component,

  properties: {
    heart: cc.Integer,
    money: cc.Integer,

    heartLabel: cc.Label,
    moneyLabel: cc.Label,
  },

  onLoad() {
    this.addHeartTimer = null;
    this.heartLabel.string = this.heart;
    this.moneyLabel.string = this.money;
    this.node.getChildByName("money").active = false;
    this.node.x -= parseInt(this.node.getChildByName("money").x);
  },

  update(dt) {
    this.updateProp();
    this.updateTimer();
  },

  onDestroy() {
    this.cleanTimerInterval();
  },

  updateProp() {
    const state = cc.sys.localStorage.getItem("userState");
    let dispatchUpd = false;

    if (state) {
      const { heart, money } = JSON.parse(state);
      if (this.heart != heart) {
        this.heart = heart;
        dispatchUpd = true;
      }
      if (this.money != money) {
        this.money = money;
        dispatchUpd = true;
      }
    }

    if (dispatchUpd) {
      this.heartLabel.string = this.heart;
      this.moneyLabel.string = this.money;
    }
  },

  updateTimer() {
    if (this.heart < 5) {
      if (this.addHeartTimer) return;

      const state = JSON.parse(cc.sys.localStorage.getItem("userState"));
      if (state.lastAddHeartTime <= 0) {
        state.lastAddHeartTime =
          Math.round(Date.now() / 1000) + (5 - state.heart) * 60;
        localStorage.setItem("userState", JSON.stringify(state));
      }
      cc.resources.load("prefab/time", cc.Prefab, (err, prefab) => {
        if (!err) {
          let timerNode = cc.instantiate(prefab);
          timerNode.y = -26;
          if (!cc.find("heart/time", this.node)) {
            cc.find("heart", this.node).addChild(timerNode);
            this.addHeartTimer = setInterval(() => {
              const state = JSON.parse(
                cc.sys.localStorage.getItem("userState")
              );
              if (state >= 5) {
                return this.cleanTimerInterval();
              }
              const now = Math.round(Date.now() / 1000);
              const diff = state.lastAddHeartTime - now;
              if (diff <= 0) {
                this.cleanTimerInterval();
              }
              let m = Math.round(((diff % (3600 * 24)) % 3600) / 60);
              let s = Math.round((diff % (3600 * 24)) % 60);
              if (s < 1) {
                state.heart += 1;
                localStorage.setItem("userState", JSON.stringify(state));
              }
              if (m > 0) m -= 1;
              if (m < 10) {
                m = `0${m}`;
              }
              if (s < 10) {
                s = `0${s}`;
              }
              const timer = cc.find("heart/time", this.node);
              timer.getComponent(cc.Label).string = `${m}:${s}`;
            }, 1000);
          }
        }
      });
    } else {
      this.cleanTimerInterval();
    }
  },

  cleanTimerInterval() {
    if (this.addHeartTimer) {
      clearInterval(this.addHeartTimer);
      this.addHeartTimer = null;
      const timer = cc.find("heart/time", this.node);
      if (timer) {
        timer.destroy();
      }
      const state = JSON.parse(cc.sys.localStorage.getItem("userState"));
      state.lastAddHeartTime = 0;
      localStorage.setItem("userState", JSON.stringify(state));
    }
  },
});

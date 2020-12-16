const { getAddTime } = require("../UserHeart");

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
    this.updateTimerLabel();
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
    if (this.node.parent.name == "buy dark") return;
    if (this.heart < 5) {
      if (!cc.find("heart/time", this.node)) {
        cc.resources.load("prefab/time", cc.Prefab, (err, prefab) => {
          if (!err) {
            let timerNode = cc.instantiate(prefab);
            timerNode.y = -26;
            cc.find("heart", this.node).addChild(timerNode);
          }
        });
      }
    }
  },

  updateTimerLabel() {
    const timer = cc.find("heart/time", this.node);
    if (!timer) {
      return;
    }
    const state = JSON.parse(cc.sys.localStorage.getItem("userState"));
    if (state >= 5) {
      timer.getComponent(cc.Label).string = "";
      return;
    }
    const diff = getAddTime();
    if (diff <= 0) {
      timer.getComponent(cc.Label).string = "";
      return;
    }
    let m = Math.floor(((diff % (3600 * 24)) % 3600) / 60);
    let s = Math.floor((diff % (3600 * 24)) % 60);
    // if (m > 0) m -= 1;
    if (m < 10) {
      m = `0${m}`;
    }
    if (s < 10) {
      s = `0${s}`;
    }
    timer.getComponent(cc.Label).string = `${m}:${s}`;
  },
});

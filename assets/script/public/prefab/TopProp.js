cc.Class({
  extends: cc.Component,

  properties: {
    heart: cc.Integer,
    money: cc.Integer,

    heartLabel: cc.Label,
    moneyLabel: cc.Label,
  },

  onLoad() {
    this.heartLabel.string = this.heart;
    this.moneyLabel.string = this.money;
    this.node.getChildByName("money").active = false;
    this.node.x -= parseInt(this.node.getChildByName("money").x);
  },

  update(dt) {
    this.updateProp();
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
});

cc.Class({
    extends: cc.Component,

    properties: {
        angleSpeed: cc.Integer
    },

    onLoad() {
        this.timer = setInterval(() => {
            this.node.angle -= this.angleSpeed;
        }, 1);
    },

    onDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = '';
        }
    },
});

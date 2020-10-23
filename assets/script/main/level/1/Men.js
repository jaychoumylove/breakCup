cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        this.node.on('_men_angry', this.setAngry, this);
    },

    onDestroy() {
        this.node.off('_men_angry', this.setAngry, this);
    },

    setAngry (evt) {
        this.node.children.map((ite,ind) => {
            if (ite._name == 'fun') {
                ite.active = false;
            }
            if (ite._name == 'angry') {
                ite.active = true;
            }
        });
    }
});

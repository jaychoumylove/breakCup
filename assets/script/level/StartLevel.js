cc.Class({
    extends: cc.Component,

    onLoad() {
        this.node.on('click', this.goLevel, this);
    },

    goLevel() {
        let level = 0;
        this.node.children.map((ite, ind) => {
            if (ite.name == 'level') {
                level = parseInt(ite.string);
            }
        })

        if (level) {
            cc.director.loadScene('level_' + level);
        }
    },
});

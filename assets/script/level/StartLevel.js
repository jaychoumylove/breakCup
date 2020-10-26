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
            const evt = new cc.Event.EventCustom('_toggle_loading', true);
            evt.setUserData({status: true});
            this.node.dispatchEvent(evt);
            cc.sys.localStorage.setItem('current_level', JSON.stringify({current: level, star: 0}))
            cc.director.loadScene('level_' + level);
        }
    },
});

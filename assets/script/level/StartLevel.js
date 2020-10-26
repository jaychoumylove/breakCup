cc.Class({
    extends: cc.Component,

    onLoad() {
        this.node.on('click', this.goLevel, this);
    },

    goLevel() {
        let level = 0;
        const levelNode = cc.find('level', this.node);
        level = parseInt(levelNode.getComponent(cc.Label).string);
        cc.log(level);

        if (level) {
            if (!this.checkHeart()) {
                return this.node.dispatchEvent(new cc.Event.EventCustom('_add_heart', true));
            }

            const dphHevt = new cc.Event.EventCustom('_state_change', true);
            dphHevt.setUserData({ heart: -1});
            this.node.dispatchEvent(dphHevt);

            const dphevt = new cc.Event.EventCustom('_toggle_loading', true);
            dphevt.setUserData({status: true});
            this.node.dispatchEvent(dphevt);
            cc.sys.localStorage.setItem('currentLevel', JSON.stringify({current: level, star: 0}));
            cc.director.loadScene('level_' + level);
        }
    },

    checkHeart() {
        const localStorage = cc.sys.localStorage;
        let state = JSON.parse(localStorage.getItem('userState'));
        return parseInt(state.heart) > 0;
    },
});

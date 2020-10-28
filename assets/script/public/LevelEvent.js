cc.Class({
    extends: cc.Component,
    
    onLoad(){
        this.node.on('_go_next_lv', this.goNextLv, this);
        this.node.on('_unlock_lv', this.unlock, this);
        this.node.on('_record_lv_star', this.recordLevelStar, this);
        this.node.on('_replay_current', this.replayCurrentLevel, this);
    },

    goNextLv() {
        const localStorage = cc.sys.localStorage;
        const { current } = JSON.parse(localStorage.getItem('currentLevel'));
        const nextLv = parseInt(current) + 1;
        const levels = JSON.parse(localStorage.getItem('userLevel'));
        const found = levels.find((item) => {
            return item.level == nextLv;
        });

        if (found) {
            cc.sys.localStorage.setItem('currentLevel', JSON.stringify({current: nextLv, star: 0}));
            cc.director.loadScene('level_' + nextLv);
        }
    },

    unlock(evt) {
        let data = evt.getUserData(), level;
        const localStorage = cc.sys.localStorage;
        if (data && data.hasOwnProperty('level')) level = data.level;
        if (!level) {
            const { current } = JSON.parse(localStorage.getItem('currentLevel'));
            level = parseInt(current) + 1;
        }

        let levels = JSON.parse(localStorage.getItem('userLevel'));
        const found = levels.find((item) => {
            return item.level == level;
        });

        if (found) {
            if (found.lock == true) {
                const lockIndex = levels.indexOf(found);
                levels[lockIndex] = Object.assign(found, {lock: false});
    
                localStorage.setItem('userLevel', JSON.stringify(levels));
                cc.director.preloadScene('level_' + level);
            }
        }
    },

    recordLevelStar(evt) {
        const data = evt.getUserData();
        const localStorage = cc.sys.localStorage;
        let cl = JSON.parse(localStorage.getItem('currentLevel'));
        cl.star = data.star;
        if (cl.star > 3) {
            cl.star = 3;
        }
        localStorage.setItem('currentLevel', JSON.stringify(cl));

        let levels = JSON.parse(localStorage.getItem('userLevel'));
        const found = levels.find((item) => {
            return item.level == cl.current;
        });

        if (found) {
            if (found.star < cl.star) {
                const lockIndex = levels.indexOf(found);
                levels[lockIndex] = Object.assign(found, {star: cl.star});
    
                localStorage.setItem('userLevel', JSON.stringify(levels));
            }
        }
    },

    replayCurrentLevel(evt) {
        const localStorage = cc.sys.localStorage;
        let cl = JSON.parse(localStorage.getItem('currentLevel'));
        cl.star = 0;
        localStorage.setItem('currentLevel', JSON.stringify(cl));
        cc.director.loadScene('level_' + cl.current);
    },
});

cc.Class({
    extends: cc.Component,

    properties: {
        heart: cc.Integer,
        money: cc.Integer,
        lastAddHeartTime: cc.Integer,
        maxLevel: cc.Integer,
    },

    onLoad() {
        // 初始化数据
        const userData = {
            heart: this.heart,
            money: this.money,
            lastAddHeartTime: this.lastAddHeartTime,
        };
        this.initByStorage('userState', userData);
        let level = [];
        for (let index = 0; index < this.maxLevel; index++) {
            const item = {
                level: index + 1,
                lock: index > 0,
                star: 0
            };
            level.push(item);
        }

        this.initByStorage('userLevel', level);
    },

    initByStorage(key, dftValue) {
        const localStorage = cc.sys.localStorage;
        let userData = localStorage.getItem(key);
        if (!userData) {
            localStorage.setItem(key, JSON.stringify(dftValue));
        }
    },
});

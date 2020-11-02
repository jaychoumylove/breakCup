// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.initState();
        const ad = cc.find("bgm").getComponent("WechatAdService");
        ad.showInterstitialAd();
        // ad.showGridAd({
        //     width: 330,
        //     top: 375,
        //     left: 10,
        // });
    },

    initState() {
        this.achievement = this.node.getChildByName('Main Camera').getChildByName('achievement');
        const state = this.getState();
        const starStateNode = this.achievement.getChildByName('star');
        starStateNode.getChildByName('state').getComponent(cc.Label).string = `${state.star.achieve}/${state.star.count}`;
        starStateNode.getChildByName('percent').getChildByName('number').getChildByName('New Label').getComponent(cc.Label).string = `${state.star.percent}`;
        const levelStateNode = this.achievement.getChildByName('level');
        levelStateNode.getChildByName('state').getComponent(cc.Label).string = `${state.level.achieve}/${state.level.count}`;
        levelStateNode.getChildByName('percent').getChildByName('number').getChildByName('New Label').getComponent(cc.Label).string = `${state.level.percent}`;
    },

    getState() {
        const storageState = JSON.parse(cc.sys.localStorage.getItem('userLevel'));
        let state = {
            star: {
                count: 0,
                achieve: 0,
                percent: 0
            },
            level: {
                count: 0,
                achieve: 0,
                percent: 0
            }
        };
        for (const item of storageState) {
            if (!item.lock) {
                state.level.achieve ++;
            }
            state.star.count += 3;
            state.star.achieve += item.star;
            state.level.count ++;
        }

        state.level.percent = this.toPercent(state.level.achieve, state.level.count); 
        state.star.percent = this.toPercent(state.star.achieve, state.star.count);
        return state;
    },

    toPercent(num, total) {
        return Math.round(num / total * 1000) / 10.0 + "%";
    }
});
 
cc.Class({
    extends: cc.Component,

    properties: {
        starGroupNode: cc.Node,
        middleFullStarSprite: cc.SpriteFrame,
        middleEmptyStarSprite: cc.SpriteFrame,
        sideFullStarSprite: cc.SpriteFrame,
        sideEmptyStarSprite: cc.SpriteFrame,

        checkDoubelNode: cc.Node,
        getRewardNode: cc.Node,

        doubelNode: cc.Node,
        redirectNode: cc.Node,
        replayNode: cc.Node,
        goNextNode: cc.Node,

        levelLabel: cc.Label,
        goldRewardLabel: cc.Label,

        reward: cc.Integer,
        doubel: true,
    },

    onLoad() {
        // 播放动画
        this.initStarAction();
        this.initBtn();
        this.initReward();
    },

    initStarAction() {
        const { star, current } = JSON.parse(cc.sys.localStorage.getItem('currentLevel'));
        this.starGroupNode.children.map((ite, ind) => {
            if (ind < star) {
                ite.getComponent(cc.Sprite).spriteFrame = ind == 1 ? this.middleFullStarSprite: this.sideFullStarSprite;
            } else {
                ite.getComponent(cc.Sprite).spriteFrame = ind == 1 ? this.middleEmptyStarSprite: this.sideEmptyStarSprite;
            }
        })
        const levels = JSON.parse(localStorage.getItem('userLevel'));
        this.goNextNode.active = current < levels.length;
        this.levelLabel.string = current;
    },

    initBtn() {
        this.getRewardNode.on('click', this.pressGetReward, this);
        this.checkDoubelNode.getComponent(cc.Toggle).node.on('toggle', this.toggleDoubel, this);
    },

    initReward() {
        this.checkDoubelNode.getComponent(cc.Toggle).isCheck = this.doubel;
        this.dispatchGold(this.doubel);
    },

    checkHeart() {
        // 检查体力
        cc.log('check heart');
        const localStorage = cc.sys.localStorage;
        let state = JSON.parse(localStorage.getItem('userState'));
        return parseInt(state.heart) > 0;
    },

    replayCurrentLevel() {
        cc.log('replay');
        const evt = new cc.Event.EventCustom('_toggle_loading', true);
        evt.setUserData({status: true});
        this.node.dispatchEvent(evt);
        this.node.dispatchEvent(new cc.Event.EventCustom('_replay_current', true));
    },

    goNextLevel() {
        cc.log('go next level');
        if (!this.checkHeart()) {
            return this.node.dispatchEvent(new cc.Event.EventCustom('_add_heart', true));
        }
        // 去下一关
        const evt = new cc.Event.EventCustom('_toggle_loading', true);
        evt.setUserData({status: true});
        this.node.dispatchEvent(evt);
        this.node.dispatchEvent(new cc.Event.EventCustom('_go_next_lv', true));
    },

    pressGetReward() {
        // 获取奖励
        cc.log('pressGetReward');
        this.doubelNode.active = false;
        this.getRewardNode.active = false;
        this.redirectNode.active = true;
        this.replayNode.on('click', this.replayCurrentLevel, this);
        this.goNextNode.on('click', this.goNextLevel, this);

        const dphevt = new cc.Event.EventCustom('_state_change', true);
        dphevt.setUserData({ money: this.reward * (this.doubel ? 2: 1)});
        this.node.dispatchEvent(dphevt);
    },

    toggleDoubel(evt) {
        // 勾选双倍
        this.dispatchGold(evt.isChecked);
    },

    dispatchGold(doubel) {
        const mul = doubel ? 2: 1;
        this.goldRewardLabel.string = parseInt(this.reward * mul);
        this.doubel = doubel;
    }
});

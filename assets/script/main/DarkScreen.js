cc.Class({
    extends: cc.Component,

    properties: {
        pauseBtnGroup: cc.Node,
        failBtnGroup: cc.Node,

        playBtn: cc.Button,
        replayBtn: cc.Button,
    },

    onLoad() {
        this.initPress();
        this.initTouch();
        this.initScreen();
    },

    onDestroy() {
        this.offTouch();
    },

    initTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.stopDispatch, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.stopDispatch, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.stopDispatch, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.stopDispatch, this);
    },

    offTouch() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.stopDispatch, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.stopDispatch, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.stopDispatch, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.stopDispatch, this);
    },

    stopDispatch(evt) {
        evt.stopPropagation();
    },

    pressPlay() {
        this.pauseBtnGroup.active = false;
        this.node.active = false;
        // this.offPress();
    },

    initPress() {
        this.playBtn.node.on('click', this.pressPlay, this);
        this.replayBtn.node.on('click', this.pressReplay, this);
        // this.pauseButton.node.on('click', this.pressPause, this);
    }, 

    offPress() {
        this.playBtn.node.off('click', this.pressPlay, this);
        // this.pauseButton.node.off('click', this.pressPause, this);
    },

    initScreen() {
        this.node.on('_pause', this.dispatchPauseScreen, this);
        this.node.on('_fail', this.dispatchFailScreen, this);
    },

    dispatchPauseScreen(evt) {
        this.failBtnGroup.active = false;
        this.pauseBtnGroup.active = true;
    },

    dispatchFailScreen(evt) {
        this.pauseBtnGroup.active = false;
        this.failBtnGroup.active = true;
    },

    pressReplay() {
        const evt = new cc.Event.EventCustom('_toggle_loading', true);
        evt.setUserData({status: true});
        this.node.dispatchEvent(evt);
        this.node.dispatchEvent(new cc.Event.EventCustom('_replay_current', true));
    },
});

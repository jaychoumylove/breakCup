cc.Class({
    extends: cc.Component,

    properties: {
        rotationLinghtNode: cc.Node,
        getHeartBtn: cc.Button,
        gotHeartContainer: cc.Node,
        menContainer: cc.Node,
        progressBarNode: cc.Node,
        changeMainImageNode: cc.Node,
        topTitle: cc.Node,
    },

    onLoad() {
        this.initTouch();
        this.initBtn();
        this.initPregressBar();
        this.initLightAction();
    }, 

    initPregressBar() {
        this.countStatus = false;
        this.progressBar = this.progressBarNode.getComponent(cc.ProgressBar);
        this.initProgressTimer = setInterval(() => {
            if (!this.countStatus && this.progressBar.progress > 0) {
                this.progressBar.progress -= 0.1;
                this.setMenEmotion();
            }
        }, 1000);
    },

    initLightAction() {
        const dft = {
            angle: this.rotationLinghtNode.angle,
        }, act = {
            angle: 360,
        };
        let up = cc.tween().to(4, act),
            down = cc.tween().to(4, dft),
            action = cc.tween().then(up).then(down);
        cc.tween(this.rotationLinghtNode).repeatForever(action).start();
        // setInterval(() => {
        //     this.rotationLinghtNode.angle -= 0.2;
        // }, 1);
    },

    initBtn() {
        this.getHeartBtn.node.on('click', this.pressGetHeart, this);
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

    pressGetHeart(evt) {
        if (this.progressBar.progress < 1) {
            this.countStatus = true;
            this.progressBar.progress = parseFloat((this.progressBar.progress + 0.1).toPrecision(1));
            this.setMenEmotion(true);
            if (this.addProgressTimer) {
                clearTimeout(this.addProgressTimer);
            }
            if (this.progressBar.progress == 1) {
                this.dispatchGot();
            } else {
                this.addProgressTimer = setTimeout(() => {
                    this.countStatus = false;
                }, 1000);
            }
        }
    },

    dispatchGot() {
        const evt = new cc.Event.EventCustom('_change_main', true);
        this.changeMainImageNode.dispatchEvent(evt);
        this.menContainer.active = false;
        this.progressBarNode.active = false;
        this.getHeartBtn.active = false;
        this.gotHeartContainer.active = true;
        this.topTitle.getComponent(cc.Label).string = '恭喜获得';
        this.gotHeartContainer.dispatchEvent(new cc.Event.EventCustom('_got', true));
    },

    setMenEmotion (emotion) {
        if (!emotion) {
            emotion = false;
        }
        const evt = new cc.Event.EventCustom('_set_emotion', true);
        evt.setUserData({emotion});
        this.menContainer.dispatchEvent(evt);
    }
});

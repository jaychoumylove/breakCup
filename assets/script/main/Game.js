cc.Class({
    extends: cc.Component,

    properties: {
        debug: false,
        gravity: cc.Vec2,

        boxContainer: cc.Node,
        menNode: cc.Node,

        scrapPrefab: cc.Prefab,
        ballDashedPrefab: cc.Prefab,
        ballStaticPrefab: cc.Prefab,
        ballDynamicPrefab: cc.Prefab,
        fourSideDynamicPrefab: cc.Prefab,
        triangleDynamicPrefab: cc.Prefab,

        mainCamera: cc.Camera,
        ballBoxLayout: cc.Layout,
        layoutSingleWH: cc.Integer,
        layoutSingleOpacity: cc.Integer,

        replayButton: cc.Button,
        pauseButton: cc.Button,

        darkScreenNode: cc.Node,
        getHeartScreenNode: cc.Node,
        getThreeStarScreenNode: cc.Node,
        bgNode: cc.Node,
    },

    onLoad () {
        cc.log(this.node);
        this.initPhysics();
        this.break = [];
        this.cupNum = 1;
        this.win = false;
        this.lose = false;
        this.fallBallArray = [
            {
                type: 'ball',
                sprite: '2',
            },
            {
                type: 'triangle',
                sprite: '3',
            },
            {
                type: 'four_side',
                sprite: '1',
            },
        ];
        this.currentBall = null;
        this.currentBallIndex = 0;
        this.initBall();
        this.node.on('_box_break', this.boxBreakHandle, this);
        this.initTouch();
        this.replayButton.node.on('click', this.pressReplay, this);
        this.pauseButton.node.on('click', this.pressPause, this);
    },

    update(dt) {},

    onDestroy() {
        // this.node.off('_box_break', this.boxBreakHandle, this);
        // this.node.off(cc.Node.EventType.TOUCH_START, this.createBall, this);
        // this.node.off(cc.Node.EventType.TOUCH_MOVE, this.moveBall, this);
        // this.node.off(cc.Node.EventType.TOUCH_END, this.fallDownBall, this);
        // this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.fallDownBall, this);
        // this.replayButton.node.off('click', this.replay);
    },

    pressReplay() {
        cc.director.loadScene('level_1');
    },

    pressPause(evt) {
        // this.offTouch();
        this.darkScreenNode.active = true;
        this.darkScreenNode.dispatchEvent(new cc.Event.EventCustom('_pause', true));
    },

    dispatchFail() {
        // this.offTouch();
        this.darkScreenNode.active = true;
        this.darkScreenNode.dispatchEvent(new cc.Event.EventCustom('_fail', true));
    },

    dispatchSuccess() {
        this.win = true;
        setTimeout(() => {
            if (this.checkHeartBag()) {
                return this.getHeartBag();
            }
            if (this.checkStar()) {
                return this.getThreeStar();
            }
            cc.sys.localStorage.setItem('last_game', JSON.stringify({star: this.getStar()}));
            cc.director.loadScene('settle', (e, s) => {
                // cc.log(e);
                // cc.log(s);
            })
        }, 2000)
    },

    getHeartBag() {
        this.getHeartScreenNode.active = true;
        this.node.on('_check_three_star', this.checkThreeStarEvt, this);
    },

    getThreeStar() {
        this.getThreeStarScreenNode.active = true;
        const evt = new cc.Event.EventCustom('_get_three_star_load', true),
            star = this.getStar();
        evt.setUserData({star});
        this.getThreeStarScreenNode.dispatchEvent(evt);
        this.node.on('_go_settle', this.goSettleEvt, this);
    },

    checkThreeStarEvt() {
        this.getHeartScreenNode.active = false;
        const status = this.checkStar();
        this.node.off('_check_three_star', this.checkThreeStarEvt, this);
        if (!status) {
            return this.getThreeStar();
        } else {
            this.goSettleEvt();
        }
    },

    goSettleEvt() {
        this.node.off('_go_settle', this.goSettleEvt, this);
        this.getThreeStarScreenNode.active = false;
        cc.sys.localStorage.setItem('last_game', JSON.stringify({star: this.getStar()}));
        cc.director.loadScene('settle', (e, s) => {
            // cc.log(e);
            // cc.log(s);
        })
    },

    initTouch() {
        this.bgNode.on(cc.Node.EventType.TOUCH_START, this.createBall, this);
        this.bgNode.on(cc.Node.EventType.TOUCH_MOVE, this.moveBall, this);
        this.bgNode.on(cc.Node.EventType.TOUCH_END, this.fallDownBall, this);
        this.bgNode.on(cc.Node.EventType.TOUCH_CANCEL, this.fallDownBall, this);
    },

    offTouch() {
        this.bgNode.off(cc.Node.EventType.TOUCH_START, this.createBall, this);
        this.bgNode.off(cc.Node.EventType.TOUCH_MOVE, this.moveBall, this);
        this.bgNode.off(cc.Node.EventType.TOUCH_END, this.fallDownBall, this);
        this.bgNode.off(cc.Node.EventType.TOUCH_CANCEL, this.fallDownBall, this);
    },

    initBall() {
        let layout = this.ballBoxLayout;
        // 初始化
        for (let ind = 0; ind < this.fallBallArray.length; ind ++) {
            const ite = this.fallBallArray[ind];
            const type = ite.type;
            let ballDashed = cc.instantiate(this.ballDashedPrefab), 
                ballStatic = cc.instantiate(this.ballStaticPrefab), 
                absolutePath = "image/base/ball/",
                image;
            
            if (type == 'ball') {
                image = 'ball_dashed';
            }

            if (type == 'four_side') {
                image = 'fourside_dashed';
            }

            if (type == 'triangle') {
                image = 'triangle_dashed';
            }

            cc.resources.load(absolutePath + image, cc.SpriteFrame, null, (e, df) => {
                ballDashed.getComponent(cc.Sprite).spriteFrame = df;
                cc.resources.load(absolutePath + ite.sprite, cc.SpriteFrame, null, (e, sf) => {
                    ballStatic.getComponent(cc.Sprite).spriteFrame = sf;
                    ballStatic.width = this.layoutSingleWH;
                    ballStatic.height = this.layoutSingleWH;
                    if (ind <= this.currentBallIndex) {
                        ballStatic.opacity = this.layoutSingleOpacity;
                    }
                    ballDashed.addChild(ballStatic);
                    
                    layout.node.addChild(ballDashed);
                    this.fallBallArray[ind].staticBall = ballStatic;
                    layout.updateLayout();
                })
            });
        }
    },

    createBall(evt) {
        if (this.currentBallIndex >= this.fallBallArray.length) return;
        
        let ball = cc.instantiate(this.fallBallArray[this.currentBallIndex].staticBall);
        ball.opacity = 255;
        let pos = evt.getLocation();
        let out = cc.v2(0, 0);
        this.mainCamera.getScreenToWorldPoint(pos,out);
        ball.x = out.x - (cc.winSize.width / 2);
        ball.y = 200;
        this.bgNode.addChild(ball);
        this.currentBall = {
            node: ball,
            current: this.currentBallIndex
        };
    },

    moveBall(evt) {
        if (this.currentBallIndex >= this.fallBallArray.length) return;
        let pos = evt.getLocation(),
            out = cc.v2(0, 0);
        this.mainCamera.getScreenToWorldPoint(pos,out);
        this.currentBall.node.x = out.x - (cc.winSize.width/2);
    },

    fallDownBall(evt) {
        if (this.currentBallIndex >= this.fallBallArray.length) return;
    
        let type = this.fallBallArray[this.currentBall.current].type,
            image = this.fallBallArray[this.currentBallIndex].sprite, 
            absolutePath = "image/base/ball/",
            prefab;
        if (type=='ball') {
            prefab = this.ballDynamicPrefab;
        }
        if (type=='four_side') {
            prefab = this.fourSideDynamicPrefab;
        }
        if (type=='triangle') {
            prefab = this.triangleDynamicPrefab;
        }
        let ball = cc.instantiate(prefab);
        ball.x = this.currentBall.node.x;
        ball.y = this.currentBall.node.y;
        cc.resources.load(absolutePath + image, cc.SpriteFrame, null, (e, df) => {
            ball.getComponent(cc.Sprite).spriteFrame = df;
            this.currentBall.node.destroy();
            this.currentBall = null;
            this.bgNode.addChild(ball);
            this.displayCurrentBall();
        });
    },

    displayCurrentBall() {
        this.currentBallIndex++;
        if (this.currentBallIndex < this.fallBallArray.length) {
            this.fallBallArray[this.currentBallIndex].staticBall.opacity = this.layoutSingleOpacity;
        } else {
            // 加载结束监听
            this.checkTimer = setInterval(() => {
                this.checkLose(false);
            }, 1000);
            setTimeout(() => {
                this.cleanCheck();
                this.checkLose(true);
            }, 5000);
        }
    },

    cleanCheck() {
        if (this.checkTimer) {
            clearInterval(this.checkTimer);
            this.checkTimer = '';
        }
    },

    checkLose(force) {
        if (this.break.length >= this.cupNum) {
            cc.log('win');
            this.cleanCheck();
            this.dispatchSuccess();
        } else {
            if (force) {
                this.dispatchFail();
            } else {
                cc.log('checking');
            }
        }
    },

    initPhysics () {
        let manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        if (this.debug) {
            manager.debugDrawFlags = true;
        }
        manager.gravity = this.gravity;
    },

    boxBreakHandle(evt) {
        const position = evt.getUserData();
        if (this.break.indexOf(position.id) < 0) {
            this.break.push(position.id);
            const scrapNode = cc.instantiate(this.scrapPrefab);
            scrapNode.x = position.x;
            scrapNode.y = position.y;
            this.boxContainer.addChild(scrapNode);
        }
        if (this.break.length >= this.cupNum) {
            cc.log('you win');
            this.menNode.dispatchEvent(new cc.Event.EventCustom('_men_angry', true));
            this.dispatchSuccess();
        }
    },
    
    /**
     * @desc 是否给体力书包
     * @return Boolean
     */
    checkHeartBag() {
        return true;
    },

    /**
     * @desc 是否满分
     * @return Boolean
     */
    checkStar() {
        return this.getStar() >= 3;
    },

    getStar() {
        return this.fallBallArray.length - this.currentBallIndex + 1;
    },
});

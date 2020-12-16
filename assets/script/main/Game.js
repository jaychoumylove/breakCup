import {
  getBallMapPath,
  getNextBall,
  getUseSkinGroup,
  updateCurrentIndex,
} from "../public/UserSkin";
import { isOppo, isWechat } from "../util/common";
import { versionCheck, getCfgVal, getOpenStatus } from "../util/ZSLoad";

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

    darkScreenPrefab: cc.Prefab,
    getHeartScreenPrefab: cc.Prefab,
    getThreeStarScreenPrefab: cc.Prefab,

    mainCamera: cc.Camera,
    ballBoxLayout: cc.Layout,
    layoutSingleWH: cc.Integer,
    layoutSingleOpacity: cc.Integer,

    replayButton: cc.Button,
    pauseButton: cc.Button,

    // darkScreenNode: cc.Node,
    // getHeartScreenNode: cc.Node,
    // getThreeStarScreenNode: cc.Node,
    bgNode: cc.Node,

    currentLabel: cc.Label,
  },

  onLoad() {
    const parentCamera = cc.find("Canvas/Main Camera");
    if (isWechat()) {
      const ad = cc.find("bgm").getComponent("WechatAdService");
      ad.setGBAd("banner", false);
      if (versionCheck()) {
        cc.resources.load(
          "prefab/horizontalScroll",
          cc.Prefab,
          (err, prefab) => {
            if (!err) {
              let node = cc.instantiate(prefab);
              node.y = -34;
              cc.find("game Bg/ground", parentCamera).addChild(node);
            }
          }
        );
      }
    }
    const darkScreenNode = cc.instantiate(this.darkScreenPrefab);
    darkScreenNode.active = false;
    const getHeartScreenNode = cc.instantiate(this.getHeartScreenPrefab);
    getHeartScreenNode.active = false;
    const getThreeStarScreenNode = cc.instantiate(
      this.getThreeStarScreenPrefab
    );
    getThreeStarScreenNode.active = false;
    cc.find("loading", parentCamera).zIndex = 5;
    cc.find("game Bg", parentCamera).zIndex = 0;
    parentCamera.addChild(darkScreenNode, 2);
    parentCamera.addChild(getHeartScreenNode, 3);
    parentCamera.addChild(getThreeStarScreenNode, 4);
    this.getHeartScreenNode = getHeartScreenNode;
    this.getThreeStarScreenNode = getThreeStarScreenNode;
    this.darkScreenNode = darkScreenNode;
    this.initPhysics();
    const { current } = JSON.parse(cc.sys.localStorage.getItem("currentLevel"));
    this.currentLevel = current;
    this.currentLabel.string = current;
    this.breakAll = []; // 存储破碎的杯子集合
    this.break = []; // 存储打碎的有效杯子 >-1
    this.cupNum = this.boxContainer.children.length;
    this.win = false;
    this.lose = false;
    this.fallBallArray = getNextBall(3);
    this.currentBall = null;
    this.currentBallIndex = 0;
    this.initBall();
    this.node.on("_box_break", this.boxBreakHandle, this);
    this.initTouch();
    this.replayButton.node.on("click", this.pressReplay, this);
    this.pauseButton.node.on("click", this.pressPause, this);
    this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
  },

  update(dt) {},

  onDestroy() {},

  pressReplay() {
    this.AudioPlayer.playOnceMusic("button");
    const evt = new cc.Event.EventCustom("_toggle_loading", true);
    evt.setUserData({ status: true });
    this.node.dispatchEvent(evt);
    this.node.dispatchEvent(new cc.Event.EventCustom("_replay_current", true));
  },

  pressPause(evt) {
    this.AudioPlayer.playOnceMusic("button");
    // this.offTouch();
    this.darkScreenNode.active = true;
    this.darkScreenNode.dispatchEvent(new cc.Event.EventCustom("_pause", true));
  },

  dispatchFail() {
    // this.offTouch();
    this.darkScreenNode.active = true;
    this.darkScreenNode.dispatchEvent(new cc.Event.EventCustom("_fail", true));
    if (isWechat()) {
      if (versionCheck()) {
        let scroll = cc.find(
          "Canvas/Main Camera/game Bg/ground/horizontalScroll"
        );
        if (scroll) {
          scroll.destroy();
        }
        if (cc.find("Canvas/openThree")) {
        } else {
          this.scheduleOnce(() => {
            cc.resources.load("prefab/openThree", cc.Prefab, (err, prefab) => {
              if (!err) {
                let openNode = cc.instantiate(prefab);
                cc.find("Canvas").addChild(openNode);
              }
            });
          }, 0);
        }
      }
    }
    if (isOppo() && versionCheck() && !getOpenStatus()) {
      cc.resources.load("prefab/SingleNativeAd", cc.Prefab, (err, prefab) => {
        if (!err) {
          const node = cc.instantiate(prefab);
          node.y = 180;
          node.getComponent("NativeAd").callBack = () => {};
          cc.find("Canvas").addChild(node);
          console.log("added prefab/SingleNativeAd");
        } else {
          // 出错直接返回到首页
          console.log("loaded prefab/SingleNativeAd failed");
          console.log(JSON.stringify(err));
        }
      });
    }
  },

  dispatchSuccess() {
    this.win = true;
    // 记录当前得分
    const status = this.checkStar();
    updateCurrentIndex();
    this.recordLevelStar();
    // 解锁下一等级
    this.unlockNextLevel();
    let openNode;
    if (isWechat()) {
      if (versionCheck()) {
        cc.resources.load("prefab/openThree", cc.Prefab, (err, prefab) => {
          if (!err) {
            openNode = cc.instantiate(prefab);
          }
        });
        let scroll = cc.find(
          "Canvas/Main Camera/game Bg/ground/horizontalScroll"
        );
        if (scroll) {
          scroll.destroy();
        }
      }
    }
    this.scheduleOnce(() => {
      if (isWechat()) {
        if (versionCheck()) {
          if (cc.find("Canvas/openThree")) {
          } else {
            if (openNode) {
              cc.find("Canvas").addChild(openNode);
            } else {
              cc.resources.load(
                "prefab/openThree",
                cc.Prefab,
                (err, prefab) => {
                  cc.log(err, prefab);
                  if (!err) {
                    openNode = cc.instantiate(prefab);
                    cc.find("Canvas").addChild(openNode);
                    // cc.find("Canvas/Main Camera").addChild(openRank);
                  }
                }
              );
            }
          }
        }
      }
      if (this.checkHeartBag()) {
        // 记录本次得分
        return this.getHeartBag();
      }

      // cc.sys.localStorage.setItem('currentLevel', JSON.stringify({current: level, star: 0}))
      if (status) {
        return this.getThreeStar();
      }
      this.goSettle();
    }, 2);
  },

  getHeartBag() {
    this.getHeartScreenNode.active = true;
    this.node.on("_check_three_star", this.checkThreeStarEvt, this);
  },

  getThreeStar() {
    this.getThreeStarScreenNode.active = true;
    const evt = new cc.Event.EventCustom("_get_three_star_load", true),
      star = this.getStar();
    evt.setUserData({ star });
    this.getThreeStarScreenNode.dispatchEvent(evt);
    this.node.on("_go_settle", this.goSettleEvt, this);
  },

  goSettle() {
    const evt = new cc.Event.EventCustom("_toggle_loading", true);
    evt.setUserData({ status: true });
    this.node.dispatchEvent(evt);
    cc.director.loadScene("settle", (e, s) => {});
  },

  checkThreeStarEvt() {
    this.getHeartScreenNode.active = false;
    const status = this.checkStar();
    this.node.off("_check_three_star", this.checkThreeStarEvt, this);
    if (!status) {
      return this.getThreeStar();
    } else {
      this.goSettleEvt();
    }
  },

  goSettleEvt() {
    this.node.off("_go_settle", this.goSettleEvt, this);
    this.getThreeStarScreenNode.active = false;
    this.goSettle();
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
    for (let ind = 0; ind < this.fallBallArray.length; ind++) {
      const ite = this.fallBallArray[ind];
      const type = ite.type;
      let ballDashed = cc.instantiate(this.ballDashedPrefab),
        ballStatic = cc.instantiate(this.ballStaticPrefab),
        absolutePath = getBallMapPath(),
        groupPath = getUseSkinGroup(),
        image;

      if (type == "ball") {
        image = "ball_dashed";
      }

      if (type == "four_side") {
        image = "fourside_dashed";
      }

      if (type == "triangle") {
        image = "triangle_dashed";
      }

      cc.resources.load(absolutePath + image, cc.SpriteFrame, null, (e, df) => {
        ballDashed.getComponent(cc.Sprite).spriteFrame = df;
        cc.resources.load(
          absolutePath + groupPath + "/" + ite.sprite,
          cc.SpriteFrame,
          null,
          (e, sf) => {
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
          }
        );
      });
    }
  },

  createBall(evt) {
    if (this.currentBallIndex >= this.fallBallArray.length) return;

    let ball = cc.instantiate(
      this.fallBallArray[this.currentBallIndex].staticBall
    );
    ball.opacity = 255;
    let pos = evt.getLocation();
    let out = cc.v2(0, 0);
    this.mainCamera.getScreenToWorldPoint(pos, out);
    ball.x = out.x - cc.winSize.width / 2;
    ball.y = 200;
    this.bgNode.addChild(ball);
    this.currentBall = {
      node: ball,
      current: this.currentBallIndex,
    };
  },

  moveBall(evt) {
    if (this.currentBallIndex >= this.fallBallArray.length) return;
    let pos = evt.getLocation(),
      out = cc.v2(0, 0);
    this.mainCamera.getScreenToWorldPoint(pos, out);
    this.currentBall.node.x = out.x - cc.winSize.width / 2;
  },

  fallDownBall(evt) {
    if (this.currentBallIndex >= this.fallBallArray.length) return;

    let type = this.fallBallArray[this.currentBall.current].type,
      image = this.fallBallArray[this.currentBallIndex].sprite,
      absolutePath = getBallMapPath(),
      groupPath = getUseSkinGroup(),
      prefab;
    if (type == "ball") {
      prefab = this.ballDynamicPrefab;
    }
    if (type == "four_side") {
      prefab = this.fourSideDynamicPrefab;
    }
    if (type == "triangle") {
      prefab = this.triangleDynamicPrefab;
    }
    let ball = cc.instantiate(prefab);
    ball.x = this.currentBall.node.x;
    ball.y = this.currentBall.node.y;
    cc.resources.load(
      absolutePath + groupPath + "/" + image,
      cc.SpriteFrame,
      null,
      (e, df) => {
        ball.getComponent(cc.Sprite).spriteFrame = df;
        this.currentBall.node.destroy();
        this.currentBall = null;
        this.bgNode.addChild(ball);
        this.displayCurrentBall();
      }
    );
  },

  displayCurrentBall() {
    this.currentBallIndex++;
    if (this.currentBallIndex < this.fallBallArray.length) {
      this.fallBallArray[
        this.currentBallIndex
      ].staticBall.opacity = this.layoutSingleOpacity;
    } else {
      // 加载结束监听
      this.checkTimer = setInterval(() => {
        this.checkLose(false);
      }, 1000);
      this.scheduleOnce(() => {
        this.cleanCheck();
        this.checkLose(true);
      }, 5);
    }
  },

  cleanCheck() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = "";
    }
  },

  checkLose(force) {
    if (this.break.length >= this.cupNum) {
      cc.log("win");
      this.cleanCheck();
      this.dispatchSuccess();
    } else {
      if (force) {
        this.dispatchFail();
      } else {
        cc.log("checking");
      }
    }
  },

  initPhysics() {
    let manager = cc.director.getPhysicsManager();
    manager.enabled = true;
    if (this.debug) {
      manager.debugDrawFlags = true;
    }
    manager.gravity = this.gravity;
  },

  boxBreakHandle(evt) {
    const position = evt.getUserData();
    if (this.breakAll.indexOf(position.id) < 0) {
      this.breakAll.push(position.id);
      // console.log(position);
      if (position.id > -1 && this.break.indexOf(position.id) < 0) {
        this.break.push(position.id);
      }
      const scrapNode = cc.instantiate(this.scrapPrefab);
      let c_pos = this.boxContainer.convertToNodeSpaceAR(position.pos);
      scrapNode.x = c_pos.x;
      scrapNode.y = c_pos.y;
      this.boxContainer.addChild(scrapNode);
    }
    if (this.break.length >= this.cupNum) {
      cc.log("you win");
      this.menNode.dispatchEvent(new cc.Event.EventCustom("_men_angry", true));
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

  recordLevelStar() {
    const evt = new cc.Event.EventCustom("_record_lv_star", true);
    evt.setUserData({ star: this.getStar() });
    this.node.dispatchEvent(evt);
  },

  unlockNextLevel() {
    this.node.dispatchEvent(new cc.Event.EventCustom("_unlock_lv", true));
  },

  getStar() {
    return this.fallBallArray.length - this.currentBallIndex + 1;
  },
});

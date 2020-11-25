cc.Class({
  extends: cc.Component,

  properties: {
    bgMusic: cc.AudioClip,
    glassBreakMusic: cc.AudioClip,
    winMusic: cc.AudioClip,
    coinMusic: cc.AudioClip,
    collectStarMusic: cc.AudioClip,
    buttonMusic: cc.AudioClip,
    ballCollisionMusic: cc.AudioClip,
  },

  onLoad() {
    this.initVolume();
    this.playBgMusic();
    this.musicMap = {
      win: this.winMusic,
      coin: this.coinMusic,
      glassBreak: this.glassBreakMusic,
      button: this.buttonMusic,
      ballCollision: this.winMusic,
      collectStar: this.collectStarMusic,
    };

    this.node.on("_play_music_once", this.playOnceMusicEvt, this);
  },

  initVolume() {
    const volumeStr = cc.sys.localStorage.getItem("userVolume");
    const volume = volumeStr ? JSON.parse(volumeStr) : { bg: true, once: true };
    if (!volumeStr) {
      cc.sys.localStorage.setItem("userVolume", JSON.stringify(volume));
    }
    this.bgStatus = volume.bg;
    this.onceStatus = volume.once;
  },

  playOnceMusic(key) {
    if (this.musicMap.hasOwnProperty(key)) {
      if (this.onceStatus) {
        cc.audioEngine.play(this.musicMap[key], false, 0.5);
      }
    }
  },

  playOnceMusicEvt(evt) {
    const data = evt.getUserData();

    if (data.hasOwnProperty("key")) {
      this.playOnceMusic(data.key);
    }
  },

  playBgMusic() {
    if (this.bgStatus) {
      this.bgMusicChannel = cc.audioEngine.play(this.bgMusic, true, 0.5);
    }
  },

  stopBgMusic: function () {
    if (this.bgMusicChannel !== undefined) {
      cc.audioEngine.stop(this.bgMusicChannel);
      this.bgMusicChannel = undefined;
    }
  },

  checkBgMusicStatus(status) {
    if (this.bgStatus != status) {
      this.bgStatus = status;
      this.updateStorageVolume("bg", status);
      status ? this.playBgMusic() : this.stopBgMusic();
    }
  },

  checkOnceMusicStatus(status) {
    if (this.onceStatus != status) {
      this.onceStatus = status;
      this.updateStorageVolume("once", status);
    }
  },

  updateStorageVolume(key, value) {
    const volume = JSON.parse(cc.sys.localStorage.getItem("userVolume"));
    if (volume[key] != value) {
      volume[key] = value;
      cc.sys.localStorage.setItem("userVolume", JSON.stringify(volume));
    }
  },
});

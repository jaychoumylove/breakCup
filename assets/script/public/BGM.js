cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        //获取全局播放器
        this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
        //停止再开启背景音乐
        this.AudioPlayer.stopBgMusic();
        this.AudioPlayer.playBgMusic();
    },
});

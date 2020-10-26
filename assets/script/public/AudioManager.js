cc.Class({
    extends: cc.Component,

    properties: {
        bgMusic: cc.AudioClip,
    },

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    },

    start() {
        this.playBgMusic();
    },
    
    playBgMusic() {
       this.bgMusicChannel = cc.audioEngine.play(this.bgMusic,true,0.5)
    },

    stopBgMusic: function () {        
        if (this.bgMusicChannel !== undefined) {
            cc.audioEngine.stop(this.bgMusicChannel);            
            this.bgMusicChannel = undefined;
        }
    },
});
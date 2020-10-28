cc.Class({
    extends: cc.Component,

    properties: {
        scene: cc.String        
    },

    onLoad () {
        this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
        this.node.on('click', this.handleRedirect, this);
        if (this.scene == 'store') {
            this.node.active = false;
        }
    },

    handleRedirect() {
        this.AudioPlayer.playOnceMusic('button');
        if (this.scene != 'store') {
            if (this.scene) {
                const evt = new cc.Event.EventCustom('_toggle_loading', true);
                evt.setUserData({status: true});
                this.node.dispatchEvent(evt);
                cc.director.loadScene(this.scene);
            }
        }
    }
});

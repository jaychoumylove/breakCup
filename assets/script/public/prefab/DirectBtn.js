cc.Class({
    extends: cc.Component,

    properties: {
        scene: cc.String        
    },

    onLoad () {
        this.node.on('click', this.handleRedirect, this);
    },

    handleRedirect() {
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
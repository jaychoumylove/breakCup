cc.Class({
    extends: cc.Component,

    properties: {
        scene: cc.String        
    },

    onLoad () {
        this.node.on('click', this.handleRedirect, this);
    },

    handleRedirect() {
        if (this.scene) {
            cc.director.loadScene(this.scene);
        }
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        showTargetNode: cc.Node,
        showContainerNode: cc.Node,
    },

    onLoad() {
        this.show = false;
        this.node.on('click', this.handleClick, this);
        this.AudioPlayer = cc.find("bgm").getComponent("AudioManager");
    },

    handleClick(evt) {
        this.AudioPlayer.playOnceMusic('button');
        if (this.showContainerNode.active) {
            return;
        }

        this.showContainerNode.active = true;
        this.showTargetNode.active = true;
        const dphEvt = new cc.Event.EventCustom('_dispatch_add_load', true);
        dphEvt.setUserData({node: this.showContainerNode});
        this.showTargetNode.dispatchEvent(dphEvt)
    },
});

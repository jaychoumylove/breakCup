cc.Class({
    extends: cc.Component,

    properties: {
        loadingNode: cc.Node,
    },

    onLoad () {
        this.node.on('_toggle_loading', this.toggleLoading, this);
    },

    start () {
        this.loadingNode.active = false;
    },

    toggleLoading(evt) {
        const { status } = evt.getUserData();
        if (this.loadingNode.active != status) {
            this.loadingNode.active = status;
        }
    },
});

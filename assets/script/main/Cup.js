cc.Class({
    extends: cc.Component,

    properties: {
        id: cc.Integer
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.tag > 0) {
            const evt = new cc.Event.EventCustom('_box_break', true);
            evt.setUserData({x: this.node.x, y: this.node.y, id: this.id});
            this.node.destroy();
            this.node.dispatchEvent(evt);
        }
    },
});

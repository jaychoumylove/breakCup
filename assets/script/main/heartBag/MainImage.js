cc.Class({
    extends: cc.Component,

    properties: {
        heartSprite: cc.SpriteFrame,
        mainImageContainer: cc.Node,
        numberContainer: cc.Node,
        size: cc.Vec2
    },

    onLoad () {
        this.node.on('_change_main', this.changeMain, this);
    },

    onDestroy() {
        this.node.off('_change_main', this.changeMain, this);
    },

    changeMain(evt) {
        if (this.heartSprite) {
            this.mainImageContainer.width = this.size.x;
            this.mainImageContainer.height = this.size.y;
            let sprite = this.mainImageContainer.getComponent(cc.Sprite);
            sprite.spriteFrame = this.heartSprite;
            this.numberContainer.active= true;
        }
    }
});

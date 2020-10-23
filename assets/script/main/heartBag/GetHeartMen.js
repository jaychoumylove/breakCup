cc.Class({
    extends: cc.Component,

    properties: {
        emotion: false, // happy|sad  true|false
        happySprite: cc.SpriteFrame,
        sadSprite: cc.SpriteFrame,
    },

    onLoad() {
        this.node.on('_set_emotion', this.setEmotion, this);
    },

    update(dt) {
        const sprite = this.emotion ? this.happySprite: this.sadSprite,
            currentSprite = this.node.getComponent(cc.Sprite).spriteFrame;

        if (currentSprite != sprite) {
            // cc.log('updated');
            this.node.getComponent(cc.Sprite).spriteFrame = sprite;
        } else {
            // cc.log('not yet');
        }
    },

    onDestroy() {
        this.node.off('_set_emotion', this.setEmotion, this);
    },

    setEmotion(evt) {
        const { emotion } = evt.getUserData();
        this.emotion = emotion;
    }
});

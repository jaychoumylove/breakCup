cc.Class({
    extends: cc.Component,

    properties: {
        direction: cc.String, // left, right
        moveNode: cc.Node,
        moveSpeed: cc.Integer,
        oppositeNode: cc.Node,

        ableSpriteFrame: cc.SpriteFrame,
        disableSpriteFrame: cc.SpriteFrame,
    },

    onLoad() {
        this.node.on('click', this.handleClick, this);
    },

    update() {
        const btn = this.node.getComponent(cc.Button);
        const spriteFrame = btn.interactable ? this.ableSpriteFrame: this.disableSpriteFrame;
        if (btn.target.getComponent(cc.Sprite).spriteFrame != spriteFrame) {
            btn.target.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }
    },

    handleClick() {
        let speed = this.moveSpeed;
        let btn = this.node.getComponent(cc.Button);
        if (this.direction == 'right') {
            speed = -speed;
        }
        const act = {
            x: this.moveNode.x + speed,
        };
        btn.interactable = false;
        cc.tween(this.moveNode)
            .to(0.3, act)
            .call((node) => {
                btn.interactable = true;
                if (!this.oppositeNode.getComponent(cc.Button).interactable) {
                    this.oppositeNode.getComponent(cc.Button).interactable = true;
                }
            })
            .start();
    },
});

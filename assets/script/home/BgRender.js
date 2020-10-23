cc.Class({
    extends: cc.Component,

    properties: {
        bgArray: [cc.Node],
        bgSpeed: 0,
    },

    getLastPositionY() {
        let posy = 0;
        for (const bg of this.bgArray) {
            if (bg.y < posy) {
                posy = bg.y;
            }
        }

        return posy;
    },

    update(dt) {
        const speed = this.bgSpeed * dt;
        let max = 0;
        this.bgArray.map(ite => {
            max += ite.y;
        });
        for (const bg of this.bgArray) {
            bg.y += speed;
            if (bg.y > bg.height) {
                // 边界重新生成
                bg.y = this.getLastPositionY() - bg.height + 10;
            }
        }
    },
});

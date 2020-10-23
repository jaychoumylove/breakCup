cc.Class({
    extends: cc.Component,

    properties: {
        ballDashedPrefab: cc.Prefab,
        ballStaticPrefab: cc.Prefab,
        staticWh: cc.Integer,
        staticOpacity: cc.Integer,
    },

    onLoad() {
        this.currentBallIndex = 0;
        this.boxArray = [
            {
                type: 'ball',
                sprite: '2',
            },
            {
                type: 'triangle',
                sprite: '3',
            },
            {
                type: 'four_side',
                sprite: '1',
            },
        ];
        this.initBox(this.boxArray);
    },

    initBox (boxArray) {
        // const boxArray = evt.getUserData();
        // this.node.width = (40 + 15) * boxArray.length;
        let layout = this.node.getComponent(cc.Layout);
        // 初始化
        for (let ind = 0; ind < boxArray.length; ind ++) {
            const ite = boxArray[ind];
            const type = ite.type;
            let ballDashed = cc.instantiate(this.ballDashedPrefab), 
                ballStatic = cc.instantiate(this.ballStaticPrefab), 
                absolutePath = "image/base/ball/",
                image;
            
            if (type == 'ball') {
                image = 'ball_dashed';
            }

            if (type == 'four_side') {
                image = 'fourside_dashed';
            }

            if (type == 'triangle') {
                image = 'triangle_dashed';
            }

            cc.resources.load(absolutePath + image, cc.SpriteFrame, null, (e, df) => {
                ballDashed.getComponent(cc.Sprite).spriteFrame = df;
                cc.resources.load(absolutePath + ite.sprite, cc.SpriteFrame, null, (e, sf) => {
                    ballStatic.getComponent(cc.Sprite).spriteFrame = sf;
                    ballStatic.width = this.staticWh;
                    ballStatic.height = this.staticWh;
                    if (ind <= this.currentBallIndex) {
                        ballStatic.opacity = this.staticOpacity;
                    }
                    ballDashed.addChild(ballStatic);
                    
                    layout.node.addChild(ballDashed);
                    this.boxArray[ind].staticBall = ballStatic;
                    this.node.getComponent(cc.Layout).updateLayout();
                })
            });
        }
    },

    getCurrentBall() {
        return this.boxArray[this.currentBallIndex].node;
    },

    falldownBall(evt) {
        this.currentBallIndex ++;
        this.boxArray.map((ite, ind) => {
            if (ind <= this.currentBallIndex) {
                ite.staticBall.opacity = this.staticOpacity;
            }
        })
    }
});

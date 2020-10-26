cc.Class({
    extends: cc.Component,

    properties: {
        groupPrefab: cc.Prefab,
        unlockItemPrefab: cc.Prefab,
        lockItemPrefab: cc.Prefab,

        rightBtnNode: cc.Node,
        leftBtnNode: cc.Node,

        fullStarSpriteFrame: cc.SpriteFrame,
        emptyStarSpriteFrame: cc.SpriteFrame,
    },

    onLoad() {
        this.list = JSON.parse(cc.sys.localStorage.getItem('userLevel'));
        this.page = 0;
        this.defaultX = this.node.x;

        let groupList = this.supportNumberGroup(this.list, 12);

        this.groupList = groupList;
        this.maxPage = parseInt(groupList.length - 1);
        this.itemWidth = 0;
        for (let index = 0; index < groupList.length; index++) {
            const element = groupList[index];
            const group = cc.instantiate(this.groupPrefab);
            if (!this.itemWidth) {
                this.itemWidth = group.width;
                this.node.width = parseInt((this.itemWidth + 10) * groupList.length - 10);
            }
            for (let ind = 0; ind < element.length; ind++) {
                const ele = element[ind];
                if (!ele.lock) {
                    const itemNode = cc.instantiate(this.unlockItemPrefab);
                    const levelNode = cc.find('level', itemNode);
                    levelNode.getComponent(cc.Label).string = ele.level;
                    const starGroupNode = cc.find('star group', itemNode);
                    starGroupNode.children.map((v, k) => {
                        if (k < ele.star) {
                            v.getComponent(cc.Sprite).spriteFrame = this.fullStarSpriteFrame;
                        } else {
                            v.getComponent(cc.Sprite).spriteFrame = this.emptyStarSpriteFrame;
                        }
                    });
                    group.addChild(itemNode);
                } else {
                    const itemNode = cc.instantiate(this.lockItemPrefab);
                    group.addChild(itemNode);
                }
            }
            this.node.addChild(group);
        }
    },

    update() {
        if (this.itemWidth) {
            this.page = (this.defaultX - this.node.x) / (this.itemWidth + 10);
        }
        if (this.page == 0) {
            this.leftBtnNode.getComponent(cc.Button).interactable = false;
        }
        if (this.page == this.maxPage) {
            this.rightBtnNode.getComponent(cc.Button).interactable = false;
        }
    },

    supportNumberGroup(list, number) {
        if (!list.length) return [];
        let newList = [];
        const length = list.length,
            lineNum = length % number === 0 ? length / number: Math.floor((length / number) + 1);
            
        for (let i = 0; i < lineNum; i ++) {
            let item = list.slice(i*number, i*number + number);
            newList.push(item);
        }
        return newList;
    },
});

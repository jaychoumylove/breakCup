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
        let max = 50,
            lockIndex = 1, 
            list = [], 
            unlockItem = {
                star: 3,
                lock: false,
            },
            lockItem = {
                star: 0,
                lock: true,
            };
        for (let index = 0; index < max; index++) {
            let item = index < lockIndex ? unlockItem: lockItem;
            list.push({
                star: item.star,
                level: parseInt(index + 1),
                lock: item.lock
            });
        }

        this.list = list;
        this.page = 0;
        this.defaultX = this.node.x;

        let groupList = this.supportNumberGroup(list, 12);

        this.groupList = groupList;
        this.maxPage = parseInt(groupList.length - 1);
        this.itemWidth = 0;
        for (let index = 0; index < groupList.length; index++) {
            const element = groupList[index];
            const group = cc.instantiate(this.groupPrefab);
            for (let ind = 0; ind < element.length; ind++) {
                const ele = element[ind];
                let itemNode;
                if (!ele.lock) {
                    itemNode = cc.instantiate(this.unlockItemPrefab);
                    for (const child of itemNode.children) {
                        if (child.name == 'level') {
                            child.string = ele.level;
                        }
                        if (child.name == 'star group') {
                            child.children.map((v, k) => {
                                if (k < ele.star) {
                                    v.getComponent(cc.Sprite).spriteFrame = this.fullStarSpriteFrame;
                                } else {
                                    v.getComponent(cc.Sprite).spriteFrame = this.emptyStarSpriteFrame;
                                }
                            })
                        }
                    }
                } else {
                    itemNode = cc.instantiate(this.lockItemPrefab);
                }
                if (!this.itemWidth) {
                    this.itemWidth = group.width;
                    this.node.width = parseInt((this.itemWidth + 10) * groupList.length);
                }
                group.addChild(itemNode);
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

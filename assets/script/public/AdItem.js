let zsSdk = require("../util/zs.sdk");

cc.Class({
    extends: cc.Component,

    properties: {
        txt_name: cc.Label,
        icon: cc.Sprite,
        spriteSize: cc.Vec2,
        adEntity: null
    },

	onEnable() {
		this.node.on(cc.Node.EventType.TOUCH_END, this.navigate2Mini, this);
	},

	onDisable() {
		this.node.off(cc.Node.EventType.TOUCH_END, this.navigate2Mini, this);
	},

	init(adEntity) {
		this.adEntity = adEntity;
		if (this.txt_name) {
			this.txt_name.string = adEntity.app_title;
		}

		if (adEntity.app_icon) {
			cc.loader.load(adEntity.app_icon, (err, texture) => {
				if (texture) {
					var spriteFrame = new cc.SpriteFrame(texture);
					if (this.icon && spriteFrame) {
						this.icon.spriteFrame = spriteFrame;
						this.icon.node.width = this.spriteSize.x;
						this.icon.node.height = this.spriteSize.y;
					}
				}
			});
		}
	},
	navigate2Mini() {
		console.log("==================", "���", this.adEntity.app_title, "======================");

		//΢��openid
		let openid = "΢��openid";

		let success = () => {
			console.log("�ɹ�");
		}

		let fail = () => { //ʧ�ܻص�
			console.log("ʧ��");
		}

		let complete = () => {
			console.log("complete ���ܳɹ���ʧ�ܶ������");
		}

		zsSdk.navigate2Mini(this.adEntity, openid, success, fail, complete);
	}
});

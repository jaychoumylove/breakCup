cc.Class({
    extends: cc.Component,

    properties: {
        force: cc.Integer,
        dynamicRiot: cc.SpriteFrame,
        staticRiot: cc.SpriteFrame,

        moveWidth: cc.Integer,
    },

    onLoad() {
        this.attack = false;
        this.node.getChildByName('riot').getComponent(cc.Sprite).spriteFrame = this.dynamicRiot;
    },
    
    start () {
    },

    update (dt) {

    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.tag > 0 && this.attack == false) {
            let forceVer = {x: 0,y :0},
                rotationToAngle = this.node.angle * Math.PI / 180;

            // 矫正坐标系方向
            let rigid = otherCollider.node.getComponent(cc.RigidBody);
            forceVer.x = this.force * Math.cos(rotationToAngle);
            forceVer.y = -this.force * Math.sin(rotationToAngle);
            const force = cc.v2(forceVer.x, Math.abs(forceVer.y));
            rigid.linearVelocity = force;
            this.changeAttackStatus();
        }
    },

    changeAttackStatus() {
        this.attack = true;
        const riotNode = this.node.getChildByName('riot');
        riotNode.getComponent(cc.Sprite).spriteFrame = this.staticRiot;
        cc.tween(riotNode)
            .to(0.1, {x: riotNode.x + this.moveWidth})
            .call(() => {

            })
            .start();

        const springNode = this.node.getChildByName('spring');

        const plysics = this.node.getComponent(cc.PhysicsBoxCollider);

        cc.tween(springNode)
            .to(0.1, {height: riotNode.width + this.moveWidth - 20})
            .call(() => {
                plysics.size.width = plysics.size.width + this.moveWidth;
                plysics.offset.x = plysics.size.width / 2; 
                plysics.apply();
            })
            .start();
    },
});

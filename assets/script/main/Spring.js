cc.Class({
    extends: cc.Component,

    properties: {
        force: cc.Integer
    },
    
    start () {
    },

    update (dt) {

    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.tag == 1) {
            let forceVer = {x: 0,y :0},
                rotationToAngle = this.node.angle * Math.PI / 180;

            // 矫正坐标系方向
            let rigid = otherCollider.node.getComponent(cc.RigidBody);
            forceVer.x = this.force * Math.cos(rotationToAngle);
            forceVer.y = -this.force * Math.sin(rotationToAngle);
            const force = cc.v2(forceVer.x, Math.abs(forceVer.y));
            rigid.linearVelocity = force;
        }
    },
});

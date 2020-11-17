let zsSdk = require("../util/zs.sdk");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        cc.log(zsSdk);
    },

    login() {
        zsSdk.login();
    },
});

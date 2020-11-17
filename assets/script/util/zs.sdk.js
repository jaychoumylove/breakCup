﻿//v2.5
var conf = {
    appId: "wx123900796a78eaa4", //请在此行填写游戏appid
    secret: "YjRXnR103ps8Eerj", //请在此行填写指色分配的密钥
    uploadLog: "true", //不用理会
    channel: "wx", //wx, oppo, vivo, tt, qq
}

var sdkStorage = {};

var setStorageSync = function (key, value) {
    sdkStorage[key] = value;
}

var getStorageSync = function (key) {
    return sdkStorage[key];
}

var getCache = function (key, expire) {
    if (!expire) {
        return getStorageSync(key);
    }
    else {
        var lastCacheTime = getStorageSync(key + "_time");
        if (lastCacheTime == null || Date.now() - Number(lastCacheTime) < expire) {
            return getStorageSync(key);
        }
        else {
            return null;
        }
    }
}

var setCache = function (key, value) {
    setStorageSync(key, value);
    setStorageSync(key + "_time", Date.now());
}

var object2Query = function (obj) {
    var args = []
    for (var k in obj)
        args.push(k + "=" + obj[k])
    return args.join("&"); // 返回对象  
}

var request = function (url, data, method, success, fail, complete) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var response = xhr.responseText;
            if (xhr.status >= 200 && xhr.status < 400) {
                var result = {};
                try {
                    result = JSON.parse(response)
                } catch (e) {
                    console.error('json parse error ', response)
                    if (fail)
                        fail(e);
                }
                if (success)
                    success(result);
            } else {
                console.error('error ', response)
                if (fail)
                    fail(response);
            }
        } else {
        }
    };
    xhr.timeout = 3000;
    xhr.ontimeout = function (event) {
        console.error('error ', event)
        if (fail)
            fail(event);
    }
    xhr.open(method, url, true);
    if (method == "POST") {
        xhr.open('POST', url);
        xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
        xhr.send(object2Query(data));
    } else {
        xhr.send();
    }
}

var md5 = function (string) {
    /**
     * ********************************************************
     */
    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    var addUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    var F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    }

    var G = function (x, y, z) {
        return (x & z) | (y & (~z));
    }

    var H = function (x, y, z) {
        return (x ^ y ^ z);
    }

    var I = function (x, y, z) {
        return (y ^ (x | (~z)));
    }

    var FF = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var GG = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var HH = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var II = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function (string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWordsTempOne = lMessageLength + 8;
        var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
        var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function (lValue) {
        var WordToHexValue = "",
            WordToHexValueTemp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValueTemp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
        }
        return WordToHexValue;
    };

    var uTF8Encode = function (string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        var output = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
    string = uTF8Encode(string);
    x = convertToWordArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return tempValue.toLowerCase();
}

var isFun = function (fun) {
    if (typeof fun == 'function')
        return true
    return false;
}

/**
 * var crypto = require('crypto');
 * 
 * var params = {
        openid: openId,
        key: key,
    }
* @param {参数} params 对象
*/
var buildSign = function (params, isSecret) {
    isSecret = isSecret || true;
    var sortedKeys = Object.keys(params).sort();
    var signParam = '';
    for (var i = 0; i < sortedKeys.length; i++) {
        signParam += sortedKeys[i] + ":" + params[sortedKeys[i]];
    }
    if (isSecret)
        signParam += conf.secret;
    // signParam = signParam.toLowerCase();
    var md5sign = md5(signParam);
    md5sign = md5sign.toLowerCase();
    return md5sign;
}

var sdk = null;

if (conf.channel === "wx") {
    var tjconf = { app_key: conf.appId, getLocation: false };
    sdk = (function () {
        var self = {};
        var adUrl = "https://ad.ali-yun.wang/api/";
        var loginUrl = "https://cpcf.wqop2018.com/api/app_login/index";
        var cfgUrl = "https://cpcf.wqop2018.com/api/list_config/index";

        var postExportAppLog = function (toid, openid) {
            var url = adUrl + "appad_new/collect";
            var currentTime = Math.round(new Date().getTime() / 1000).toString();
            var signParams = {
                user_id: openid,
                from_id: conf.appId,
                to_id: toid,
                timestamp: currentTime,
            };
            var sign = buildSign(signParams);

            var data = Object.assign({}, signParams, {
                sign: sign,
            });
            request(url, data, 'POST',
                function () { },
                function () {
                    console.log('appad_new/collect fail');
                },
                function () {
                    console.log('appad_new/collect complete');
                });
        }

        /**
         * 跳转成功之后数据上报
         * @param {number} row  从loadAd接口中返回的数组项   @example indexLeft[0]
         * @param {string} userid  小游戏中的用户Id
         */
        var collect = function (row, userid) {
            if (row.app_type == "3") {
                var value = getStorageSync(row.appid);
                if (value == null) {
                    setStorageSync(row.appid, 1);
                }
                else {
                    setStorageSync(row.appid, Number(value) + 1);
                }
            }
            if (typeof wx === 'undefined') {
                return;
            }
            postExportAppLog(row.app_id, userid);
        }

        /**
         * 请求登录接口，返回用户openid
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        var zsLogin = function (success, fail, data) {
            request(loginUrl, data, 'POST',
                function (res) {
                    if (res.code != 200) {
                        fail(res.msg);
                    }
                    else {
                        success(res.data.openid);
                    }
                },
                function (error) {
                    fail(error);
                },
                function (res) {
                    console.log('requestAdData complete');
                }
            );
        }

        self.userId = null;
        self.srcAppId = "";
        self.launchScene = "";
        self.init = function (user_id) {
            console.log("zsAdSdk.init");
            !function () {
                function e() {
                    this.concurrency = 200, this.queue = [], this.tasks = [], this.activeCount = 0; var e = this; this.push = function (n) {
                        this.tasks.push(new Promise(function (t, r) {
                            var a = function a() {
                                e.activeCount++ , n().then(function (e) {
                                    t(e);
                                }).then(function () {
                                    e.next();
                                });
                            };
                            e.activeCount < e.concurrency ? a() : e.queue.push(a);
                        }));
                        console.log('3');
                    }, this.all = function () {
                        console.log('4');
                        return Promise.all(this.tasks);
                    }, this.next = function () {
                        console.log('5');
                        e.activeCount-- , e.queue.length > 0 && e.queue.shift()();
                    };
                }
                function n() {
                    return new Promise(function (e, n) {
                        if(cd == ''){
                            wx.login({
                                success: function (t) {
                                    cd = t.code;
                                    console.log(cd + '---------');
                                    e("");
                                }
                            });
                        }
                    });
                } function t() {
                    return new Promise(function (e, n) {
                        wx.getNetworkType({
                            success: function success(n) {
                                e(n);
                            }, fail: function fail() {
                                e("");
                            }
                        });
                    });
                } function r() {
                    return new Promise(function (e, n) {
                        "1044" == S.scene ? wx.getShareInfo({
                            shareTicket: S.shareTicket, success: function success(n) {
                                e(n);
                            }, fail: function fail() {
                                e("");
                            }
                        }) : e("");
                    });
                } function a() {
                    return new Promise(function (e, n) {
                        d.getLocation ? wx.getLocation({
                            success: function success(n) {
                                e(n);
                            }, fail: function fail() {
                                e("");
                            }
                        }) : wx.getSetting({
                            success: function success(n) {
                                n.authSetting["scope.userLocation"] ? (wx.getLocation({
                                    success: function success(n) {
                                        e(n);
                                    }, fail: function fail() {
                                        e("");
                                    }
                                }), e("")) : e("");
                            }, fail: function fail() {
                                e("");
                            }
                        });
                    });
                } function s() {
                    function e() {
                        return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
                    } return e() + e() + e() + e() + e() + e() + e() + e();
                } function o(e, n, k) {
                    function t() {
                        return new Promise(function (n, t) {
                            let tjxx = wx.getStorageSync('tjxx');
                            if (undefined !== tjxx.openid) {
                                for (k in tjxx) {
                                    e[k] = tjxx[k];
                                }
                            }
                        
                            if (e.cd == '') {
                                n("");
                            }else {
                                y++; let l = 'ad.ali-yun';
                                wx.request({
                                    url: 'https://ad.ali-yun.wang/api/app_jump/in', data: e, header: { se: v || "", op: w || "", img: b || "" }, method: "POST", success: function success(d) {
                                        wx.setStorageSync('tjxx', d.data);
                                        clearTimeout(dshi);
                                        dsq = true;
                                        if (undefined !== d.data.rtime && parseInt(d.data.rtime) > 0){
                                            dshi= setTimeout(function () {o(e,n,2); }, parseInt(d.data.rtime)*1000);
                                        }else if (undefined !== tjxx.rtime && parseInt(tjxx.rtime) > 0) {
                                            dshi = setTimeout(function () { o(e, n, 2); }, parseInt(tjxx.rtime) * 1000);
                                        }
                                    }, fail: function fail() {
                                        dsq = true;
                                        if (undefined !== tjxx.rtime && parseInt(tjxx.rtime) > 0){
                                            clearTimeout(dshi);
                                            dshi = setTimeout(function () { o(e, n, 2); }, parseInt(tjxx.rtime) * 1000);
                                        }
                                    }
                                });
                            }
                        });
                    }
                    e.rq_c = y, e.cd = cd, e.ifo = h, e.ak = d.app_key, e.uu = g, e.v = f, e.st = Date.now(), e.ev = n, e.wsr = S, e.ufo = i(e.ufo), e.ec = _; // e.as = q, e.at = m, 
                    if (undefined===k){
                        wx.Queue.push(t);   
                    }else {
                        t();
                    }        
                } function i(e) {
                    if (void 0 === e || "" === e) return ""; var n = {}; for (var t in e) {
                        "rawData" != t && "errMsg" != t && (n[t] = e[t]);
                    } return n;
                }; 
                function c(e) {
                    var n = {}; for (var t in e) {
                        n[t] = e[t];
                    } return n;
                } function u(e) {
                    for (var n = "", t = 0; t < e.length; t++) {
                        e[t].length > n.length && (n = e[t]);
                    } return n;
                }
                wx.Queue = new e(), wx.Queue.all(); var f = "1.0.0",
                    l = "glog",
                    d = tjconf; "" === d.app_key && console.error("请在配置文件中填写您的app_key"), d.app_key = d.app_key.replace(/\s/g, "");
                //function () {wx.request({ url: "https://" + l + ".aldwx.com/config/app.json", method: "GET", success: function success(e){200 === e.statusCode && (e.data.version != f && console.warn("您的SDK不是最新版本，请尽快升级！"), e.data.warn && console.warn(e.data.warn), e.data.error && console.error(e.data.error));}});}();
                var h = "",
                    g = function () {
                        var e = ""; try {
                            e = wx.getStorageSync("h_stat_uuid"), wx.setStorageSync("h_ifo", !0);
                        } catch (n) {
                            e = "uuid_getstoragesync";
                        } if (e) h = !1; else {
                            e = s(), h = !0; try {
                                wx.setStorageSync("h_stat_uuid", e);
                            } catch (e) {
                                wx.setStorageSync("h_stat_uuid", "uuid_getstoragesync");
                            }
                        } return e;
                    }(),
                    p = {},
                    v = "",
                    w = "",
                    _ = 0,
                    y = "",
                    S = wx.getLaunchOptionsSync(),
                    x = Date.now(),
                    m = "" + Date.now() + Math.floor(1e7 * Math.random()),
                    q = "" + Date.now() + Math.floor(1e7 * Math.random()),
                    k = 0,
                    M = "",
                    b = "",
                    dsq = false,
                    dshi,
                    cd = '',
                    O = !0,
                    D = ["h_SendEvent", "h_OnShareAppMessage", "h_ShareAppMessage", "h_SendSession", "h_SendOpenid"]; (function () {
                        return Promise.all([n(), t(), a()]);
                    })().then(function (e) {
                        "" !== e[2] ? (p.lat = e[2].latitude || "", p.lng = e[2].longitude || "", p.spd = e[2].speed || "") : (p.lat = "", p.lng = "", p.spd = ""), "" !== e[1] ? p.nt = e[1].networkType || "" : p.nt = ""; var n = c(p); "" !== e[0] && (n.ufo = e[0], M = e[0]), o(n, "init");
                    }), wx.onShow(function (e) {
                        y = 0, S = e, k = Date.now(), O || (m = "" + Date.now() + Math.floor(1e7 * Math.random()), h = !1, wx.setStorageSync("h_ifo", !1)), O = !1; var n = c(p),
                            t = c(p); n.sm = k - x, e.query.h_share_src && e.shareTicket && "1044" === e.scene ? (t.tp = "h_share_click", r().then(function (e) {
                                t.ct = e, o(t, "event");
                            })) : e.query.h_share_src && (t.tp = "h_share_click", t.ct = "1", o(t, "event")), o(n, "show");
                    }), wx.onHide(function () {
                        var e = c(p); e.dr = Date.now() - k, "" === M ? wx.getSetting({
                            success: function success(n) {
                                n.authSetting["scope.userInfo"] ? wx.getUserInfo({
                                    success: function success(n) {
                                        e.ufo = n, M = n, b = u(n.userInfo.avatarUrl.split("/")), o(e, "hide");
                                    }
                                }) : o(e, "hide");
                            }
                        }) : o(e, "hide");
                    }), wx.onError(function (e) {
                        var n = c(p); n.tp = "h_error_message", n.ct = e, _++ , o(n, "event");
                    }); for (var I = {
                        h_SendEvent: function h_SendEvent(e, n) {
                            var t = c(p); "" !== e && "string" == typeof e && e.length <= 255 ? (t.tp = e, "string" == typeof n && n.length <= 255 ? (t.ct = String(n), o(t, "event")) : "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) ? (JSON.stringify(n).length >= 255 && console.error("自定义事件参数不能超过255个字符"), t.ct = JSON.stringify(n), o(t, "event")) : void 0 === n || "" === n ? o(t, "event") : console.error("事件参数必须为String,Object类型,且参数长度不能超过255个字符")) : console.error("事件名称必须为String类型且不能超过255个字符");
                        }, h_OnShareAppMessage: function h_OnShareAppMessage(e) {
                            wx.updateShareMenu({
                                withShareTicket: !0, complete: function complete() {
                                    wx.onShareAppMessage(function () {
                                        var n = e(),
                                            t = "",
                                            r = ""; t = void 0 !== n.success ? n.success : "", r = void 0 !== n.fail ? n.fail : ""; var a = ""; a = void 0 !== S.query.h_share_src ? void 0 !== n.query ? (S.query.h_share_src.indexOf(g), n.query + "&h_share_src=" + S.query.h_share_src + "," + g) : (S.query.h_share_src.indexOf(g), "h_share_src=" + S.query.h_share_src + "," + g) : void 0 !== n.query ? n.query + "&h_share_src=" + g : "h_share_src=" + g; var s = c(p); return n.query = a, s.ct = n, s.tp = "h_share_chain", o(s, "event"), n.success = function (e) {
                                                s.tp = "h_share_status", o(s, "event"), "" !== t && t(e);
                                            }, n.fail = function (e) {
                                                s.tp = "h_share_fail", o(s, "event"), "" !== r && r(e);
                                            }, n;
                                    });
                                }
                            });
                        }, h_ShareAppMessage: function h_ShareAppMessage(e) {
                            var n = e,
                                t = "",
                                r = ""; t = void 0 !== n.success ? n.success : "", r = void 0 !== n.fail ? n.fail : ""; var a = ""; a = void 0 !== S.query.h_share_src ? void 0 !== n.query ? (S.query.h_share_src.indexOf(g), n.query + "&h_share_src=" + S.query.h_share_src + "," + g) : (S.query.h_share_src.indexOf(g), "h_share_src=" + S.query.h_share_src + "," + g) : void 0 !== n.query ? n.query + "&h_share_src=" + g : "h_share_src=" + g, n.query = a; var s = c(p); s.ct = n, s.tp = "h_share_chain", o(s, "event"), n.success = function (e) {
                                    s.tp = "h_share_status", o(s, "event"), "" !== t && t(e);
                                }, n.fail = function (e) {
                                    s.tp = "h_share_fail", o(s, "event"), "" !== r && r(e);
                                }, wx.updateShareMenu({
                                    withShareTicket: !0, complete: function complete() {
                                        wx.shareAppMessage(n);
                                    }
                                });
                        }, h_SendSession: function h_SendSession(e) {
                            if ("" === e || !e) return void console.error("请传入从后台获取的session_key"); var n = c(p); n.tp = "session", n.ct = "session", v = e, "" === M ? wx.getSetting({
                                success: function success(e) {
                                    e.authSetting["scope.userInfo"] ? wx.getUserInfo({
                                        success: function success(e) {
                                            n.ufo = e, o(n, "event");
                                        }
                                    }) : o(n, "event");
                                }
                            }) : (n.ufo = M, "" !== M && (n.gid = ""), o(n, "event"));
                        }, h_SendOpenid: function h_SendOpenid(e) {
                            if ("" === e || !e) return void console.error("openID不能为空"); w = e; var n = c(p); n.tp = "openid", n.ct = "openid", o(n, "event");
                        }
                    }, P = 0; P < D.length; P++) {
                    !function (e, n) {
                        Object.defineProperty(wx, e, { value: n, writable: !1, enumerable: !0, configurable: !0 });
                    }(D[P], I[D[P]]);
                } try {
                    var T = wx.getSystemInfoSync(); p.br = T.brand || "", p.md = T.model, p.pr = T.pixelRatio, p.sw = T.screenWidth, p.sh = T.screenHeight, p.ww = T.windowWidth, p.wh = T.windowHeight, p.lang = T.language, p.wv = T.version, p.sv = T.system, p.wvv = T.platform, p.fs = T.fontSizeSetting, p.wsdk = T.SDKVersion, p.bh = T.benchmarkLevel || "", p.bt = T.battery || "", p.wf = T.wifiSignal || "", p.lng = "", p.lat = "", p.nt = "", p.spd = "", p.ufo = "";
                } catch (e) { }
            }();
        }
        var linkSceneList = [1011, 1012, 1013, 1025, 1031, 1032, 1047, 1048, 1049, 1124, 1125, 1126];
        self.adCbList = [];
        self.inAdRequest = false;
        //  更改  增加  isFromLink  场景值是否大于0
        self.isFromLink = function () {
            if (this.launchInfo && linkSceneList.indexOf(this.launchInfo.scene) >= 0) {
                console.log("open by code");
                return true;
            }
            return this.launchInfo != null && this.launchInfo.query != null && this.launchInfo.query.customLink != null;
        }
        /**
         * 获取广告数据
         * @param {*} callback 
         * @returns  more 更多好玩 个人中心的广告 现已经不用了
         *   promotion 首页推广   首页开始按钮下的广告
         *   indexFloat 首页浮动广告 首页右上的广告
         *   indexLeft 首页侧栏
         *   gameFloat 游戏页浮动广告 
         *   endPage 结束页广告
         */
        self.loadAd = function (callback) {
            var cacheExpire = 1000 * 60 * 10;
            var cache = getCache("zsAd", cacheExpire);
            if (cache) {
                callback(cache);
            }
            else if (this.inAdRequest) {
                this.adCbList.push(callback);
            }
            else {
                this.inAdRequest = true;
                this.adCbList.push(callback);

                var url = adUrl + "appad_new/index";
                var currentTime = Math.round(new Date().getTime() / 1000).toString();
                var signParams = {
                    appid: conf.appId,
                    timestamp: currentTime,
                };
                var sign = buildSign(signParams);
                var data = Object.assign({}, signParams, { sign: sign });
                request(url, data, 'POST',
                    function (res) {
                        self.inAdRequest = false;
                        for (var z in res.data) {
                            var arr = res.data[z];
                            arr.sort(function () { return Math.random() > 0.5 ? 1 : -1; });
                        }
                        var retValue = {
                            /**
                             * 个人中心的广告 现已经不用了
                             */
                            more: res.data["position-1"] || [],
                            /**
                             * 首页开始按钮下的广告
                             */
                            promotion: res.data["position-2"] || [],
                            /**
                             * 首页右上的浮动广告
                             */
                            indexFloat: res.data["position-3"] || [],
                            /**
                             * 首页右上的浮动广告
                             */
                            banner: res.data["position-4"] || [],
                            /**
                             * 首页侧栏
                             */
                            indexLeft: res.data["position-7"] || [],
                            /**
                             * 游戏页浮动广告
                             */
                            gameFloat: res.data["position-8"] || [],
                            /**
                             * 结束页广告
                             */
                            endPage: res.data["position-9"] || [],
                            /**
                             * 首页左侧浮动广告
                             */
                            indexLeftFloat: res.data["position-11"] || [],
                            /**
                             * 返回页广告
                             */
                            backAd: res.data["position-12"] || [],
                            /**
                             * ios跳转列表
                             */
                            iosLinkAd: res.data["position-13"] || [],
                        }
                        setCache("zsAd", retValue);
                        for (var index = 0; index < self.adCbList.length; index++) {
                            if (isFun(self.adCbList[index])) self.adCbList[index](retValue);
                        }
                        self.adCbList = [];
                    },
                    function (error) {
                        self.inAdRequest = false;
                        console.log('requestAdData fail');
                        var retValue = {
                            /**
                             * 个人中心的广告 现已经不用了
                             */
                            more: [],
                            /**
                             * 首页开始按钮下的广告
                             */
                            promotion: [],
                            /**
                             * 首页右上的浮动广告
                             */
                            indexFloat: [],
                            /**
                             * 首页右上的浮动广告
                             */
                            banner: [],
                            /**
                             * 首页侧栏
                             */
                            indexLeft: [],
                            /**
                             * 游戏页浮动广告
                             */
                            gameFloat: [],
                            /**
                             * 结束页广告
                             */
                            endPage: [],
                            /**
                             * 首页左侧浮动广告
                             */
                            indexLeftFloat: [],
                            /**
                             * 返回页广告
                             */
                            backAd: [],
                            /**
                             * ios跳转列表
                             */
                            iosLinkAd: [],
                        }
                        for (var index = 0; index < self.adCbList.length; index++) {
                            if (isFun(self.adCbList[index])) self.adCbList[index](retValue);
                        }
                        self.adCbList = [];
                    },
                    function (res) {
                        console.log('requestAdData complete');
                    }
                );
            }
        }

        /**
         * 跳转小程序
         * @param {*} row    从loadAd接口中返回的数组项   @example indexLeft[0]
         * @param {*} openid 小游戏中的用户openid
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         * @param {function} complete 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        self.navigate2Mini = function (row, openid, success, fail, complete) {
            var targetMini = row;
            if (typeof wx === 'undefined') {
                if (isFun(fail))
                    fail();
                if (isFun(complete))
                    complete();
                return;
            }

            targetMini.extraData = targetMini.extraData || {};
            wx.navigateToMiniProgram({
                appId: targetMini.appid,
                path: targetMini.link_path,
                extraData: targetMini.extraData,
                success: function (e) {
                    collect(targetMini, openid);
                    if (isFun(success))
                        success();
                },
                fail: function (e) {
                    if (isFun(fail))
                        fail();
                },
                complete: function (e) {
                    if (isFun(complete))
                        complete();
                }
            })
        }

        /**
         * 微信登录鉴权
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        self.login = function (success, fail) {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        zsLogin(success, fail, { code: res.code, appid: conf.appId })
                    }
                    else {
                        if (fail) fail("微信登陆失败");
                    }
                },
                fail: function () {
                    if (fail) fail("微信登陆失败");
                },
                complete: function () {
                }
            });

        }

        /**
         * 获取广告控制相关参数
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        self.loadCfg = function (success, fail) {
            var sceneId = 0;
            if (typeof wx !== 'undefined') {
                var sysInfo = wx.getLaunchOptionsSync();
                sceneId = sysInfo && sysInfo.scene || 0;
            }
            request(cfgUrl, { appid: conf.appId, scene: sceneId }, 'POST',
                function (res) {
                    if (res.code != 200) {
                        fail(res.msg);
                    }
                    else {
                        success(res.data);
                    }
                },
                function (error) {
                    fail(error);
                },
                function (res) {
                    console.log('loadCfg complete');
                }
            );
        }

        return self;

    })();
}
else if (conf.channel === "oppo") {
    sdk = (function () {

        var self = {};
        var adUrl = "https://platform.qwpo2018.com/api/";
        var loginUrl = "https://platform.qwpo2018.com/api/oppo_login/index";
        var cfgUrl = "https://platform.qwpo2018.com/api/list_config/index";

        var uploadNavigateEvent = function (data, openid) {

            var url = adUrl + "apk_ad/click_log";
            var data = {
                apk_id: conf.appId,
                link_id: data.link_id,
                user_id: openid
            }
            request(url, data, 'POST',
                function () {
                    console.log('uploadNavigateEvent success');
                },
                function () {
                    console.log('uploadNavigateEvent fail');
                },
                function () {
                    console.log('uploadNavigateEvent complete');
                });
        }

        var sendAppFrom = function () {
            if (self.userId == null) {
                console.error("userId is null");
                return;
            }

            if (typeof qg === 'undefined') {
                return;
            }

            var launch = qg.getLaunchOptionsSync();
            var extraData = launch && launch.referrerInfo ? launch.referrerInfo.extraData : null;
            if (!extraData || !extraData.from) {
                return;
            }

            var url = adUrl + "oppo_in/index";
            var data = {
                from_id: extraData.from,
                oppo_id: conf.appId,
                user_id: self.userId,
                from_path: extraData.path ? extraData.path : "0",
                from_page: launch.referrerInfo.package ? launch.referrerInfo.package : "0"
            };
            request(url, data, 'POST',
                function () {
                    console.log('oppo_in success');
                },
                function () {
                    console.log('oppo_in fail');
                },
                function () {
                    console.log('oppo_in complete');
                }
            );
        }

        /**
         * 请求登录接口，返回用户openid
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        var zsLogin = function (success, fail, data) {
            request(loginUrl, data, 'POST',
                function (res) {
                    if (res.code != 200) {
                        fail(res.msg);
                    }
                    else {
                        success(res.data.user_id);
                    }
                },
                function (error) {
                    fail(error);
                },
                function (res) {
                    console.log('requestAdData complete');
                }
            );
        }

        self.userId = null;
        self.init = function (user_id) {
            this.userId = user_id;
            sendAppFrom();
        }

        self.cfgCbList = [];
        self.inCfgRequest = false;
        self.adCbList = [];
        self.inAdRequest = false;
        /**
         * 获取广告数据
         * @param {*} callback 
         * @returns  more 更多好玩 个人中心的广告 现已经不用了
         *   promotion 首页推广   首页开始按钮下的广告
         *   indexFloat 首页浮动广告 首页右上的广告
         *   indexLeft 首页侧栏
         *   gameFloat 游戏页浮动广告 
         *   endPage 结束页广告
         */
        self.loadAd = function (callback) {
            var cacheExpire = 1000 * 60 * 10;
            var cache = getCache("zsAd", cacheExpire);
            if (cache) {
                callback(cache);
            }
            else if (this.inAdRequest) {
                this.adCbList.push(callback);
            }
            else {
                this.inAdRequest = true;
                this.adCbList.push(callback);

                var url = adUrl + "apk_ad/index";
                request(url, { apk_id: conf.appId }, 'POST',
                    function (res) {
                        // console.log("loadAd:" + JSON.stringify(res));
                        self.inAdRequest = false;
                        res.data.sort(function () { return Math.random() > 0.5 ? 1 : -1; });
                        for (var i = 0; i < res.data.length; ++i) {
                            res.data[i].app_icon = res.data[i].link_img;
                            res.data[i].app_title = res.data[i].link_name;
                            res.data[i].app_desc = res.data[i].link_name;
                            res.data[i].app_desc = res.data[i].link_des;
                            res.data[i].link_id = res.data[i].id;
                            res.data[i].pkg_name = res.data[i].link_page;
                            res.data[i].path = res.data[i].link_path;
                        }
                        var retValue = {
                            /**
                             * 首页开始按钮下的广告
                             */
                            promotion: res.data
                        }
                        // console.log("zsAd", retValue);
                        setCache("zsAd", retValue);
                        for (var index = 0; index < self.adCbList.length; index++) {
                            if (isFun(self.adCbList[index])) self.adCbList[index](retValue);
                        }
                        self.adCbList = [];
                    },
                    function (error) {
                        self.inAdRequest = false;
                        console.log('requestAdData fail');
                        var retValue = {
                            /**
                             * 首页开始按钮下的广告
                             */
                            promotion: []
                        }
                        for (var index = 0; index < self.adCbList.length; index++) {
                            if (isFun(self.adCbList[index])) self.adCbList[index](retValue);
                        }
                        self.adCbList = [];
                    },
                    function (res) {
                        console.log('requestAdData complete');
                    }
                );
            }
        }

        /**
         * 跳转小程序
         * @param {*} row    从loadAd接口中返回的数组项   @example indexLeft[0]
         * @param {*} openid 小游戏中的用户openid
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         * @param {function} complete 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        self.navigate2Mini = function (row, openid, success, fail, complete) {
            var targetMini = row;
            var navigateData = targetMini.extraData || {};
            navigateData.from = conf.appId;
            qg.navigateToMiniGame({
                pkgName: targetMini.pkg_name,
                path: targetMini.path,
                extraData: navigateData,
                success: function () {
                    uploadNavigateEvent(targetMini, openid);
                    console.log("targetMini:", targetMini);
                    if (isFun(success))
                        success();
                },
                fail: function () {
                    if (isFun(fail))
                        fail();
                }
            });
            console.log("navigateData:" + JSON.stringify(navigateData));
        }

        /**
         * 登录鉴权
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        self.login = function (success, fail) {
            qg.login({
                success: function (res) {
                    if (res.code == 0) {
                        zsLogin(success, fail, { code: res.data.token, apk_id: conf.appId })
                    }
                    else {
                        if (fail) fail("oppo登陆失败");
                    }
                },
                fail: function () {
                    if (fail) fail("oppo登陆失败");
                },
                complete: function () {
                }
            });
        }

        /**
         * 获取广告控制相关参数
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        self.loadCfg = function (success, fail) {
            request(cfgUrl, { apk_id: conf.appId }, 'POST',
                function (res) {
                    if (res.code != 200) {
                        fail(res.msg);
                    }
                    else {
                        success(res.data);
                    }
                },
                function (error) {
                    fail(error);
                },
                function (res) {
                    console.log('loadCfg complete');
                }
            );
        }
        self.isExportValid = function () {
            return true;
        }
    
        self.isFromLink = function () {
            return false;
        }

        return self;
    })();
}
else if (conf.channel === "vivo") {
    sdk = (function () {

        var self = {};
        var adUrl = "https://platform.qwpo2018.com/api/";
        var loginUrl = "https://platform.qwpo2018.com/api/vivo_login/index";
        var cfgUrl = "https://platform.qwpo2018.com/api/list_config/index";

        var uploadNavigateEvent = function (data, openid) {

            var url = adUrl + "apk_ad/click_log";
            var data = {
                apk_id: conf.appId,
                link_id: data.link_id,
                user_id: openid
            }
            request(url, data, 'POST',
                function () {
                    console.log('uploadNavigateEvent success');
                },
                function () {
                    console.log('uploadNavigateEvent fail');
                },
                function () {
                    console.log('uploadNavigateEvent complete');
                });
        }


        /**
         * 请求登录接口，返回用户openid
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        var zsLogin = function (success, fail, data) {
            request(loginUrl, data, 'POST',
                function (res) {
                    if (res.code != 200) {
                        fail(res.msg);
                    }
                    else {
                        success(res.data.user_id);
                    }
                },
                function (error) {
                    fail(error);
                },
                function (res) {
                    console.log('zsLogin complete');
                }
            );
        }

        self.cfgCbList = [];
        self.inCfgRequest = false;
        self.adCbList = [];
        self.inAdRequest = false;
        /**
         * 获取广告数据
         * @param {*} callback 
         * @returns  more 更多好玩 个人中心的广告 现已经不用了
         *   promotion 首页推广   首页开始按钮下的广告
         *   indexFloat 首页浮动广告 首页右上的广告
         *   indexLeft 首页侧栏
         *   gameFloat 游戏页浮动广告 
         *   endPage 结束页广告
         */
        self.loadAd = function (callback) {
            var cacheExpire = 1000 * 60 * 10;
            var cache = getCache("zsAd", cacheExpire);
            if (cache) {
                callback(cache);
            }
            else if (this.inAdRequest) {
                this.adCbList.push(callback);
            }
            else {
                this.inAdRequest = true;
                this.adCbList.push(callback);

                var url = adUrl + "apk_ad/index";
                request(url, { apk_id: conf.appId }, 'POST',
                    function (res) {
                        // console.log("loadAd:" + JSON.stringify(res));
                        self.inAdRequest = false;
                        res.data.sort(function () { return Math.random() > 0.5 ? 1 : -1; });
                        for (var i = 0; i < res.data.length; ++i) {
                            res.data[i].app_icon = res.data[i].link_img;
                            res.data[i].app_title = res.data[i].link_name;
                            res.data[i].app_desc = res.data[i].link_name;
                            res.data[i].app_desc = res.data[i].link_des;
                            res.data[i].link_id = res.data[i].id;
                            res.data[i].pkg_name = res.data[i].link_page;
                            res.data[i].path = res.data[i].link_path;
                        }
                        var retValue = {
                            /**
                             * 首页开始按钮下的广告
                             */
                            promotion: res.data
                        }
                        // console.log("zsAd", retValue);
                        setCache("zsAd", retValue);
                        for (var index = 0; index < self.adCbList.length; index++) {
                            if (isFun(self.adCbList[index])) self.adCbList[index](retValue);
                        }
                        self.adCbList = [];
                    },
                    function (error) {
                        self.inAdRequest = false;
                        console.log('requestAdData fail');
                        var retValue = {
                            /**
                             * 首页开始按钮下的广告
                             */
                            promotion: []
                        }
                        for (var index = 0; index < self.adCbList.length; index++) {
                            if (isFun(self.adCbList[index])) self.adCbList[index](retValue);
                        }
                        self.adCbList = [];
                    },
                    function (res) {
                        console.log('requestAdData complete');
                    }
                );
            }
        }
        /**
         * 跳转小程序
         * @param {*} row    从loadAd接口中返回的数组项   @example indexLeft[0]
         * @param {*} openid 小游戏中的用户openid
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         * @param {function} complete 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        self.navigate2Mini = function (row, openid, success, fail, complete) {
            var targetMini = row;
            var navigateData = targetMini.extraData || {};
            navigateData.from = conf.appId;
            qg.navigateToMiniGame({
                pkgName: targetMini.pkg_name,
                path: targetMini.path,
                extraData: navigateData,
                success: function () {
                    uploadNavigateEvent(targetMini, openid);
                    console.log("targetMini:", targetMini);
                    if (isFun(success))
                        success();
                },
                fail: function () {
                    if (isFun(fail))
                        fail();
                }
            });
            console.log("navigateData:" + JSON.stringify(navigateData));
        }

        /**
         * 登录鉴权
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        self.login = function (success, fail) {
            console.log("zsSdk.login..", "vivo平台版本为：" + qg.getSystemInfoSync().platformVersionCode);
            if (qg.getSystemInfoSync().platformVersionCode >= 1053) {
                qg.login().then((res) => {
                    if (res.data.token) {
                        var data = JSON.stringify(res.data);
                        console.log(data);
                        zsLogin(success, fail, { code: res.data.token, apk_id: conf.appId })
                    }
                }, (err) => {
                    if (failedHandler) failedHandler.runWith(JSON.stringify(err));
                    console.log("vivo login fail", JSON.stringify(err));
                });
            } else {
                qg.authorize({
                    type: "code",
                    success: function (data) {
                        console.log(data);
                        zsLogin(success, fail, { code: data.code, apk_id: conf.appId })
                    },
                    fail: function (data, code) {
                        if (failedHandler) failedHandler.runWith(JSON.stringify(code));
                        console.log("vivo login fail", JSON.stringify(data));
                    }
                })
            }
        }

        /**
         * 获取广告控制相关参数
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        self.loadCfg = function (success, fail) {
            request(cfgUrl, { apk_id: conf.appId }, 'POST',
                function (res) {
                    if (res.code != 200) {
                        fail(res.msg);
                    }
                    else {
                        success(res.data);
                    }
                },
                function (error) {
                    fail(error);
                },
                function (res) {
                    console.log('loadCfg complete');
                }
            );
        }

        return self;
    })();
}
else if (conf.channel == "tt") {
    sdk = (function () {

        var self = {};
        var adUrl = "https://platform.qwpo2018.com/api/";
        var loginUrl = "https://platform.qwpo2018.com/api/jrtt_login/index";
        var cfgUrl = "https://platform.qwpo2018.com/api/list_config/index";

        var sendAppFrom = function () {
            if (!conf.uploadLog) {
                return;
            }
            if (self.userId == null) {
                console.error("userId is null");
                return;
            }
            if (typeof tt === 'undefined') {
                return;
            }
            var launch = tt.getLaunchOptionsSync();

            var url = adUrl + "jrtt_jump/index";
            var data = {
                appid: conf.appId,
                from_id: self.srcAppId,
                user_id: self.userId,
                from_path: launch.query ? launch.query : "0"
            }
            request(url, data, 'POST',
                function () { },
                function () {
                    console.log('jrtt_jump/index" fail');
                },
                function () {
                    console.log('jrtt_jump/index" complete');
                });
        }

        /**
         * 请求登录接口，返回用户openid
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        var zsLogin = function (success, fail, data) {
            request(loginUrl, data, 'POST',
                function (res) {
                    if (res.code != 200) {
                        fail(res.msg);
                    }
                    else {
                        success(res.data.openid);
                    }
                },
                function (error) {
                    fail(error);
                },
                function (res) {
                    console.log('requestAdData complete');
                }
            );
        }

        self.userId = null;
        self.srcAppId = "";
        self.init = function (user_id) {
            console.log("zsAdSdk.init");
            this.userId = user_id;
            if (typeof tt === 'undefined') {
                this.srcAppId = "0";
            }
            else {
                var launchInfo = tt.getLaunchOptionsSync();
                this.launchScene = launchInfo.scene ? launchInfo.scene : "";
                this.srcAppId = launchInfo.referrerInfo && launchInfo.referrerInfo.appId ? launchInfo.referrerInfo.appId : "0";
            }
            sendAppFrom();
        }

        self.adCbList = [];
        self.inAdRequest = false;
        /**
         * 获取广告数据
         * @param {*} callback 
         * @returns  more 更多好玩 个人中心的广告 现已经不用了
         *   promotion 首页推广   首页开始按钮下的广告
         *   indexFloat 首页浮动广告 首页右上的广告
         *   indexLeft 首页侧栏
         *   gameFloat 游戏页浮动广告 
         *   endPage 结束页广告
         */
        self.loadAd = function (callback) {
            var cacheExpire = 1000;
            var cache = getCache("zsAd", cacheExpire);
            if (cache) {
                callback(cache);
            }
            else if (this.inAdRequest) {
                this.adCbList.push(callback);
            }
            else {
                this.inAdRequest = true;
                this.adCbList.push(callback);

                var url = adUrl + "apk_ad/index";
                var currentTime = Math.round(new Date().getTime() / 1000).toString();
                var signParams = {
                    apk_id: conf.appId,
                    timestamp: currentTime,
                };
                var sign = buildSign(signParams);
                var data = Object.assign({}, signParams, { sign: sign });
                request(url, data, 'POST',
                    function (res) {
                        self.inAdRequest = false;
                        res.data.sort(function () { return Math.random() > 0.5 ? 1 : -1; });
                        console.log("res.data", res.data);
                        for (var i = 0; i < res.data.length; ++i) {
                            res.data[i].app_icon = res.data[i].link_img;
                            res.data[i].app_title = res.data[i].link_name;
                            res.data[i].app_desc = res.data[i].link_name;
                            res.data[i].app_desc = res.data[i].link_des;
                            res.data[i].link_id = res.data[i].id;
                            res.data[i].app_id = res.data[i].link_appid;
                            res.data[i].pkg_name = res.data[i].link_page;
                            res.data[i].path = res.data[i].link_path;
                        }
                        var retValue = {
                            /**
                             * 首页开始按钮下的广告
                             */
                            promotion: res.data
                        }
                        setCache("zsAd", retValue);
                        for (var index = 0; index < self.adCbList.length; index++) {
                            if (isFun(self.adCbList[index])) self.adCbList[index](retValue);
                        }
                        self.adCbList = [];
                    },
                    function (error) {
                        self.inAdRequest = false;
                        console.log('requestAdData fail');
                        var retValue = {
                            /**
                             * 首页开始按钮下的广告
                             */
                            promotion: []
                        }
                        for (var index = 0; index < self.adCbList.length; index++) {
                            if (isFun(self.adCbList[index])) self.adCbList[index](retValue);
                        }
                        self.adCbList = [];
                    },
                    function (res) {
                        console.log('requestAdData complete');
                    }
                );
            }
        }

        // 打开游戏盒子
        self.showMoreGamesModal = function (success, fail) {
            if (typeof tt === 'undefined' || typeof tt.showMoreGamesModal != 'function') {
                return;
            }
            tt.offNavigateToMiniProgram(); //取消所有监听
            tt.offMoreGamesModalClose();
            // 监听弹窗关闭
            tt.onMoreGamesModalClose(function (res) {
                console.log("modal closed", res);
            });
            // 监听小游戏跳转
            tt.onNavigateToMiniProgram(function (res) {
                if (res) {
                    console.log("是否有跳转的小游戏", res);
                    if (res.errCode == 0) {
                        if (isFun(success))
                            success();
                    } else {
                        if (isFun(fail))
                            fail();
                    }

                }
            });

            const systemInfo = tt.getSystemInfoSync();
            // iOS 不支持，建议先检测再使用
            var navigateData = {};
            navigateData.appId = conf.appId;
            if (systemInfo.platform !== "ios") {
                // 打开互跳弹窗
                tt.showMoreGamesModal({
                    appLaunchOptions: [
                        {
                            extraData: navigateData
                        }
                    ],
                    success(res) {
                        console.log("showMoreGamesModal success", res.errMsg);
                    },
                    fail(res) {
                        console.log("showMoreGamesModal fail", res.errMsg);
                    }
                });
            }
        }

        /**
         * 登录鉴权
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        self.login = function (success, fail) {
            tt.login({
                force: false,
                success: function (res) {
                    console.log(res)
                    if (res.code || res.anonymousCode) {
                        zsLogin(success, fail, { appid: conf.appId, code: res.code || "", anonymous_code: res.anonymousCode })
                    }
                    else {
                        if (fail) fail("头条登陆失败");
                    }
                },
                fail: function () {
                    if (fail) fail("头条登陆失败");
                },
                complete: function () {
                }
            });
        }

        /**
         * 获取广告控制相关参数
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        self.loadCfg = function (success, fail) {
            request(cfgUrl, { apk_id: conf.appId }, 'POST',
                function (res) {
                    if (res.code != 200) {
                        fail(res.msg);
                    }
                    else {
                        success(res.data);
                    }
                },
                function (error) {
                    fail(error);
                },
                function (res) {
                    console.log('loadCfg complete');
                }
            );
        }

        return self;
    })();
}
else if (conf.channel == "qq") {
    sdk = (function () {

        var self = {};

        //更改  接口修改
        var adUrl = "https://platform.qwpo2018.com/api/";
        var loginUrl = "https://platform.qwpo2018.com/api/qq_login/index";
        var cfgUrl = "https://platform.qwpo2018.com/api/list_config/index";

        var sendQQFrom = function () {
            if (self.userId == null) {
                console.error("userId is null");
                return;
            }
            //更改   接口修改
            var url = adUrl + "qq_jump/index";
            var data = {
                appid: conf.appId,
                from_id: self.srcAppId ? self.srcAppId : self.launchScene,
                user_id: self.userId
            }
            request(url, data, 'POST',
                function () {
                    console.log("qq_jump/index  --> success");
                },
                function () {
                    console.log("qq_jump/index  --> fail");
                },
                function (res) {
                    console.log('qq_jump/index  --> complete', res);
                });
        }

        /**
         * 请求登录接口，返回用户openid
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        var zsLogin = function (success, fail, data) {
            request(loginUrl, data, 'POST',
                function (res) {
                    if (res.code != 200) {
                        fail(res.msg);
                    }
                    else {
                        success(res.data.openid);
                    }
                },
                function (error) {
                    fail(error);
                },
                function (res) {
                    console.log('requestAdData complete');
                }
            );
        }

        self.userId = null;
        self.srcAppId = "";
        self.launchScene = "";
        self.init = function (user_id) {
            console.log("zsAdSdk.init");
            this.userId = user_id;
            if (typeof qq === 'undefined') {
                this.launchScene = 1038;
                this.srcAppId = "";
            }
            else {
                var launchInfo = qq.getLaunchOptionsSync();
                this.launchScene = launchInfo.scene ? launchInfo.scene : "";
                this.srcAppId = launchInfo.referrerInfo && launchInfo.referrerInfo.appId ? launchInfo.referrerInfo.appId : "";
                console.debug("来路统计" + this.srcAppId);
            }
            sendQQFrom();
        }

        self.cfgCbList = [];
        self.inCfgRequest = false;
        self.loadCfg = function (success, fail) {
            var currentTime = Math.round(new Date().getTime() / 1000).toString();
            var signParams = {
                apk_id: conf.appId,
                timestamp: currentTime,
            };
            var sign = buildSign(signParams);

            var data = Object.assign({}, signParams, {
                sign: sign,
            });

            request(cfgUrl, data, 'POST',
                function (res) {
                    if (res.code != 200) {
                        fail(res.msg);
                    }
                    else {
                        success(res.data);
                    }
                },
                function (error) {
                    fail(error);
                },
                function (e) {
                    console.log('post loadConfig complete');
                }
            );
        }

        self.adCbList = [];
        self.inAdRequest = false;
        /**
         * 获取广告数据
         * @param {*} callback 
         * @returns  more 更多好玩 个人中心的广告 现已经不用了
         *   promotion 首页推广   首页开始按钮下的广告
         *   indexFloat 首页浮动广告 首页右上的广告
         *   indexLeft 首页侧栏
         *   gameFloat 游戏页浮动广告 
         *   endPage 结束页广告
         */
        self.loadAd = function (callback) {
            var cacheExpire = 1000;
            var cache = getCache("zsAd", cacheExpire);
            if (cache) {
                callback(cache);
            }
            else if (this.inAdRequest) {
                this.adCbList.push(callback);
            }
            else {
                this.inAdRequest = true;
                this.adCbList.push(callback);
                //更改  调用正常  接口地址需修改   url
                var url = adUrl + "apk_ad/index";
                var currentTime = Math.round(new Date().getTime() / 1000).toString();
                var signParams = {
                    apk_id: conf.appId,
                    timestamp: currentTime,
                };
                var sign = buildSign(signParams);
                var data = Object.assign({}, signParams, { sign: sign });
                request(url, data, 'POST',
                    function (res) {
                        //更改  数据错误判断  if(!res.data)return;
                        if (!res.data) return;
                        self.inAdRequest = false;
                        res.data.sort(function () { return Math.random() > 0.5 ? 1 : -1; });
                        console.log("res.data", res.data);
                        for (var i = 0; i < res.data.length; ++i) {
                            res.data[i].app_icon = res.data[i].link_img;
                            res.data[i].app_title = res.data[i].link_name;
                            res.data[i].app_desc = res.data[i].link_name;
                            res.data[i].app_desc = res.data[i].link_des;
                            res.data[i].link_id = res.data[i].id;
                            res.data[i].app_id = res.data[i].link_appid;
                            res.data[i].pkg_name = res.data[i].link_page;
                            res.data[i].path = res.data[i].link_path;
                        }
                        var retValue = {
                            /**
                             * 首页开始按钮下的广告
                             */
                            promotion: res.data
                        }
                        setCache("zsAd", retValue);
                        for (var index = 0; index < self.adCbList.length; index++) {
                            if (isFun(self.adCbList[index])) self.adCbList[index](retValue);
                        }
                        self.adCbList = [];
                    },
                    function (error) {
                        self.inAdRequest = false;
                        console.log('requestAdData fail');
                        var retValue = {
                            /**
                             * 首页开始按钮下的广告
                             */
                            promotion: []
                        }
                        for (var index = 0; index < self.adCbList.length; index++) {
                            if (isFun(self.adCbList[index])) self.adCbList[index](retValue);
                        }
                        self.adCbList = [];
                    },
                    function (res) {
                        console.log('requestAdData complete');
                    }
                );
            }
        }
        var linkSceneList = [];
        //  更改  增加  isFromLink  场景值是否大于0
        self.isFromLink = function () {
            if (this.launchInfo && linkSceneList.indexOf(this.launchInfo.scene) >= 0) {
                console.log("open by code");
                return true;
            }
            return this.launchInfo != null && this.launchInfo.query != null && this.launchInfo.query.customLink != null;
        }

        /**
         * QQ登录鉴权
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        self.login = function (success, fail) {
            qq.login({
                success: function (res) {
                    if (res.code) {
                        zsLogin(success, fail, { code: res.code, appid: conf.appId })
                    }
                    else {
                        if (fail) fail("QQ登陆失败");
                    }
                },
                fail: function () {
                    if (fail) fail("QQ登陆失败");
                },
                complete: function () {
                }
            });

        }

        self.launchInfo = null;
        var onAppLaunch = function () {
            if (typeof qq === 'undefined') {
            }
            else {
                self.launchInfo = qq.getLaunchOptionsSync();
                console.debug("scene:" + self.launchInfo.scene)
                if (self.isFromLink()) {
                    console.debug("open by link");
                }
            }
        }

        onAppLaunch();

        return self;
    })();
}
else {
    sdk = (function () {

        var self = {};

        /**
         * 获取广告数据
         * @param {*} callback 
         * @returns  more 更多好玩 个人中心的广告 现已经不用了
         *   promotion 首页推广   首页开始按钮下的广告
         *   indexFloat 首页浮动广告 首页右上的广告
         *   indexLeft 首页侧栏
         *   gameFloat 游戏页浮动广告 
         *   endPage 结束页广告
         */
        self.loadAd = function (callback) {
        }
        /**
         * 跳转小程序
         * @param {*} row    从loadAd接口中返回的数组项   @example indexLeft[0]
         * @param {*} openid 小游戏中的用户openid
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         * @param {function} complete 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        self.navigate2Mini = function (row, openid, success, fail, complete) {
        }

        /**
         * 微信登录鉴权
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        self.login = function (success, fail) {
        }

        /**
         * 获取广告控制相关参数
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        self.loadCfg = function (success, fail) {
        }

        return self;
    })();
}

var runningEnv = (typeof window !== 'undefined' ? window : global)
runningEnv.zs = runningEnv.zs || {};
runningEnv.zs.sdk = sdk;

(function () {
    var moduleName = sdk;
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = moduleName;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () { return moduleName; });
    } else {
        this.moduleName = moduleName;
    }
}).call(
    function () {
        return this || (typeof window !== 'undefined' ? window : global);
    });
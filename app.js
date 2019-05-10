function e(e, n, t) {
    return n in e ? Object.defineProperty(e, n, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[n] = t, e;
}

var n;

App({
    onLaunch: function() {
        var e = this, n = wx.getStorageSync("logs") || [];
        n.unshift(Date.now()), wx.setStorageSync("logs", n), wx.login({
            success: function(e) {}
        }), wx.getSetting({
            success: function(n) {
                n.authSetting["scope.userInfo"] && wx.getUserInfo({
                    success: function(n) {
                        e.globalData.userInfo = n.userInfo, e.userInfoReadyCallback && e.userInfoReadyCallback(n);
                    }
                });
            }
        });
    },
    globalData: (n = {
        userInfo: null,
        bgPic: null,
        scale: 1,
        rotate: 0,
        hat_center_x: 0
    }, e(n, "hat_center_x", 0), e(n, "currentHatId", 1), n)
});
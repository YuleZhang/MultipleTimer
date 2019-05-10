var a = getApp();

Page({
    data: {},
    onLoad: function(t) {
        var e = this;
        wx.getImageInfo({
            src: a.globalData.bgPic,
            success: function(a) {
                e.bgPic = a.path, e.draw();
            }
        });
    },
    onReady: function() {},
    draw: function() {
        var t = a.globalData.scale, e = a.globalData.rotate, n = a.globalData.hat_center_x, c = a.globalData.hat_center_y, o = a.globalData.currentHatId, s = wx.createCanvasContext("myCanvas"), i = wx.getSystemInfoSync().windowWidth, l = 100 * t;
        s.clearRect(0, 0, i, 300), s.drawImage(this.bgPic, i / 2 - 150, 0, 300, 300), s.translate(n, c), 
        s.rotate(e * Math.PI / 180), s.drawImage("../../image/" + o + ".png", -l / 2, -l / 2, l, l), 
        s.draw();
    },
    savePic: function() {
        var a = wx.getSystemInfoSync().windowWidth;
        wx.canvasToTempFilePath({
            x: a / 2 - 150,
            y: 0,
            height: 300,
            width: 300,
            canvasId: "myCanvas",
            success: function(a) {
                wx.saveImageToPhotosAlbum({
                    filePath: a.tempFilePath,
                    success: function(a) {
                        wx.showToast({
                            title: "失败",
                            duration: 2e3,
                            mask: !0,
                            icon: "success",
                            success: function() {
                                wx.navigateTo({
                                    url: "../index/index",
                                    success: function(a) {},
                                    fail: function(a) {},
                                    complete: function(a) {}
                                });
                            },
                            fail: function() {},
                            complete: function() {}
                        }), console.log("success:" + a);
                    },
                    fail: function(a) {
                        console.log("err:" + a);
                    }
                });
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: "抖音最火的动漫遮脸头像制作"
        };
    }
});
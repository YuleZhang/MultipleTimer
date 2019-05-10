var a = getApp();

Page({
    data: {
        bgPic: null,
        picChoosed: !1,
        //存储计时器
        setInter: '',
        time: "00:00:00",
        sec: 0,
        min: 0,
        hour: 0,
    },
    bindGetUserInfo: function(a) {
        a.detail.userInfo && this.setData({
            bgPic: a.detail.userInfo.avatarUrl,
            picChoosed: !0
        });
    },
    assignPicChoosed: function() {
        this.data.bgPic ? this.setData({
            picChoosed: !0
        }) : this.setData({
            picChoosed: !1
        });
    },
    getAvatar: function() {
        var e = this;
        a.globalData.userInfo ? (this.setData({
            bgPic: a.globalData.userInfo.avatarUrl
        }), this.assignPicChoosed()) : wx.getUserInfo({
            success: function(s) {
                a.globalData.userInfo = s.userInfo, e.setData({
                    userInfo: s.userInfo,
                    bgPic: s.userInfo.avatarUrl
                }), e.assignPicChoosed();
            }
        });
    },
    chooseImage: function(a) {
        var e = this;
        wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ a.target.dataset.way ],
            success: function(a) {
                a.tempFilePaths;
                e.setData({
                    bgPic: a.tempFilePaths[0]
                }), e.assignPicChoosed();
            },
            fail: function(a) {
                e.assignPicChoosed();
            },
            complete: function(a) {
                e.assignPicChoosed();
            }
        });
    },
    startSetInter: function () {
      var that = this;
      //将计时器赋值给setInter
      that.data.setInter = setInterval(
        function () {
          that.data.sec += 1;
          var timeShow;
          if (that.data.sec>=60)
          {
            that.data.sec=0;
            that.data.min+=1;
          }
          if(that.data.min>=60)
          {
            that.data.sec = 0;
            that.data.min = 0;
            that.data.hour += 1;
          }
          that.data.hour < 10 ? timeShow = "0" + that.data.hour : timeShow += that.data.hour;
          timeShow+=":";
          that.data.min < 10 ? timeShow += "0" + that.data.min : timeShow += that.data.min;
          timeShow += ":";
          that.data.sec < 10 ? timeShow += "0" + that.data.sec : timeShow += that.data.sec;
          that.setData({ time: timeShow });
          console.log('setInterval==' + that.data.num);
        }
        , 2000);
    },
    handleGra:function(){
      
      wx.showToast({
        title: '提交成功',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
    },
    onUnload: function () {
      var that = this;
      //清除计时器  即清除setInter
      clearInterval(that.data.setInter)
    },
    endSetInter: function () {
      var that = this;
      //清除计时器  即清除setInter
      clearInterval(that.data.setInter)
    },
    nextPage: function() {
        a.globalData.bgPic = this.data.bgPic, wx.navigateTo({
            url: "../imageeditor/imageeditor"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "抖音最火的动漫遮脸头像制作"
        };
    }
});
var a = getApp();

Page({
  data: {
    isStart: false,
    showRank: true,
    userInfo: {},
    //存储计时器
    setInter: '',
    time: "00:00:00",
    name: "",
    num: null,
    grade: "",
    sec: 0,
    min: 0,
    hour: 0,
    isSubmitTime: false,
    userName: null,
    userGroup: null,
    rank: null,
    showRankType: 0,
    password: null
  },

  startOrStopTimer: function () {
    var that = this;
    if (!that.data.isStart) {
      that.setData({
        time: "00:00:00"
      });
      that.data.sec = 0;
      that.data.min = 0;
      that.data.hour = 0;
      //将计时器赋值给setInter
      that.data.setInter = setInterval(
        function () {
          that.data.sec += 1;
          var timeShow;
          if (that.data.sec >= 60) {
            that.data.sec = 0;
            that.data.min += 1;
          }
          if (that.data.min >= 60) {
            that.data.sec = 0;
            that.data.min = 0;
            that.data.hour += 1;
          }
          that.data.hour < 10 ? timeShow = "0" + that.data.hour : timeShow += that.data.hour;
          timeShow += ":";
          that.data.min < 10 ? timeShow += "0" + that.data.min : timeShow += that.data.min;
          timeShow += ":";
          that.data.sec < 10 ? timeShow += "0" + that.data.sec : timeShow += that.data.sec;
          that.setData({ time: timeShow });
        }
        , 1000);
      that.setData({
        isSubmitTime: false
      })
    } else {
      clearInterval(that.data.setInter);
      that.setData({
        isSubmitTime: true
      })
    }
    this.setData({
      isStart: !that.data.isStart
    })
  },
  login: function() {
    if (this.data.password == 'shisizhongdui') {
      this.setData({
        isLogin: false,
        isAdmin: false
      })
    } else if (this.data.password == 'shisizhongduiadmin') {
      this.setData({
        isLogin: false,
        isAdmin: true
      })
    } else {
      wx.showToast({
        title: '密码错误!',
        icon: 'none'
      })
    }
  },
  changeUserName: function (e) {
    this.data.userName = e.detail.value;
  },
  changeUserGroup: function (e) {
    this.data.userGroup = e.detail.value;
  },
  changeLoginPassword: function (e) {
    this.data.password = e.detail.value;
  },
  //提交成绩
  submitTime: function () {
    var that = this;
    if (null == this.data.userName || this.data.userName == "" || this.data.userName.indexOf(" ") == 0) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return;
    }
    if (null == this.data.userGroup || this.data.userGroup == "") {
      wx.showToast({
        title: '请输入组号',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return;
    }
    this.setData({
      isSubmitTime: false
    });
    wx.showToast({
      title: '正在提交中。。。',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    const db = wx.cloud.database({});
    db.collection('todos').add({
      data: {
        grade: that.data.time,
        name: that.data.userName,
        group: that.data.userGroup,
        mark: '1'
      },
      success(res) {
        wx.showToast({
          title: '提交成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      },
      fail: function() {
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          duration: 1000,
          mask: true
        });
        that.setData({
          isSubmitTime: true
        });
      }
    })
  },
  clearAllTime: function () {
    var that = this;
    
    wx.showModal({
      title: '警告',
      content: '确定清除所有网络数据库数据？',
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            icon: 'loading',
            title: '删除中',
            duration: 5000,
          })
          //删除
          wx.cloud.callFunction({
            name: 'clearAllTime',
            success(res) {
              wx.showToast({
                icon: 'success',
                title: '删除成功',
              })
            },
            fail(err) {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
              })
            }
          })
        }
      }
    })
  },
  //成绩排序
  sortGrade: function (userList) {
    //有问题
    var tmpUsers = userList;
    var lenArr = tmpUsers.length;
    var exList = new Array();
    for (var i = 0; i < lenArr; i++) {
      if (exList[tmpUsers[i].group + ' '] == null) {
        exList[tmpUsers[i].group + ' '] = new Array()
      }
      exList[tmpUsers[i].group + ' '].push(tmpUsers[i])
    }
    for (var key in exList) {
      exList[key].sort(function (a, b) { return a.grade.localeCompare(b.grade) });
    }
    return exList;
  },
  //查看排行
  showRank: function () {
    var that = this;
    wx.showToast({
      title: '正在获取排名数据',
      icon: 'loading',
      duration: 5000
    })
    //读取数据所有数据库数据
    const db = wx.cloud.database({});
    //读取数据
    db.collection('todos').get({
      success(res) {
        wx.showToast({
          title: '查询成功',
          icon: 'success',
          duration: 500,
          mask: true
        })
        //数据排序
        that.rank = that.sortGrade(res.data);
        console.log(that.rank);
        // var nameArr = new Array();
        // var gradeArr = new Array();
        // var userArr = new Array();
        // for (var i = 0; i < tmpUsers.length; i++) {
        //   userArr[i] = { rank: "" + (i + 1), userName: tmpUsers[i].name, grade: tmpUsers[i].grade };
        // }
        that.showDialogGroup()
      }
    });
  },
  showDialogGroup: function() {
    var arr = []
    for (var key in this.rank) {
      arr.push(key)
    }
    if (arr.length == 0) {
      wx.showToast({
        title: '无数据',
        icon: 'none'
      })
    }
    this.setData({
      showRankType: 1,
      groupArray: arr
    });
  },
  showDialogRank: function(e) {
    var rank = this.rank[e.currentTarget.id];
    var arr = [];
    for (var i = 0; i < rank.length; i++) {
      arr[i] = {
        'rank': i + 1,
        'name': rank[i]['name'],
        'grade': rank[i]['grade']
      };
    }
    this.setData({
      showRankType: 2,
      rankArray: arr
    });
  },
  // 禁止屏幕滚动
  preventTouchMove: function () {
  },

  // 弹出层里面的弹窗
  back: function () {
    if (this.data.showRankType == 2) {
      this.setData({
        showRankType: 1
      })
    } else {
      this.setData({
        showRankType: 0
      })
    }
  },

  onUnload: function () {
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
  },
  onLoad: function () {
    //初始化云
    wx.cloud.init({
      env: 'multicounter-6v3a2',
      traceUser: true
    });
    console.log("云初始化成功");
    //初始数据
    this.setData({
      isSubmitTime: false,
      showRankType: 0,
      isLogin: true,
      isAdmin: false
    })
  },
  onShareAppMessage: function () {
    return {
      title: "十四中队专属多人计时器"
    };
  }
});
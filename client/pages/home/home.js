//index.js
var app = getApp();
Page({
  data:{
    userInfo: {},
    list: [
      // {
      //   title: "",
      //   content: "",
      //   yearmonth: "",
      //   time: "",
      //   txtStyle: "",
      //   itemstyle: "",
      // },
    ],
    delBtnWidth: 70,   //这里的单位是rpx
  },
  viewtop: function(e){
    wx.navigateTo({
      url: '../edit/edit',
    })
  },
  onLoad: function (option) {
    var that = this
    var addList = that.data.list;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    // 获取从编辑页面存储的storage
    wx.getStorage({
      key: 'edit',
      success: function (res) {
        // 将获取到的数据添加到当前页面的list中
        var i;
        for (i = 0; i < res.data.length; ++i) {
          addList.push(res.data[i]);
        }
        that.setData({
          list: addList
        });
      },
    });
  },
  // 手指接触到屏幕的时候触发这个函数
  touchS: function(e){
    // console.log(e);
    // 判断接触到屏幕的是否只有一个手指
    if(e.touches.length == 1){
      this.setData({
        // 记录下当前触摸这个点的clientX
        startX: e.touches[0].clientX
      });
    }
  },
  // 当手指在屏幕上移动时触发这个函数,手指每移动一次就触发一次
  touchM: function(e){
    // 判断在屏幕上移动的只有一个手指
    if(e.touches.length == 1){
      // 记录当前这个点的clientX
      var moveX = e.touches[0].clientX;
      // 记录手指起始点的clientX与当前位置的clientX的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      // 如果手指移动的距离小于或者等于0，表示没有移动会移动的方向错误，文本层的位置不变
      if(disX == 0 || disX < 0){
        txtStyle = "left: 0px";   //这里也可以等于空
      }else if(disX > 0){
        // 如果手指移动的位置大于0，那么文本层的left值就等于移动的距离
        txtStyle = "left: -" + disX + "px"; 
        // 限定可移动的最大值为按钮的宽度
        if(disX >= delBtnWidth){
          txtStyle = "left: -" + delBtnWidth + "px";
        }
      }
      // 获取正在发生操作的这条数据
      var index = e.currentTarget.dataset.index;
      var addList = this.data.list;
      addList[index].txtStyle = txtStyle;
      this.setData({
        list: addList
      })
    }
  },
  // 手指触摸动作结束后触发这个函数
  touchE: function(e){
    // console.log(e);
    // 判断手指触摸结束这个动作时是不是只有一个手机
    if(e.changedTouches.length == 1){
      // 记录触摸结束时的clientX
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      // 如果移动的距离小于按钮的1/2，则不显示删除按钮
      var txtStyle = disX > delBtnWidth/2 ? "left: -" + delBtnWidth + "px":"left: 0px";
      // 获取当前手指操作的项
      var index = e.currentTarget.dataset.index;
      var addList = this.data.list;
      addList[index].txtStyle = txtStyle;
      this.setData({
        list: addList
      })
    }
  },
  delItem: function(e){
    console.log(this.data.list);
    var that = this;
    // 获取需要删除的元素的下标
    var index = e.currentTarget.dataset.index;
    console.log(e.currentTarget.dataset.index);
    console.log(index);
    var addList = this.data.list;
    var itemstyle = "";
    
    
    itemstyle = "transform: translateX(-100%);transition: 0.3s;"; 
    addList[index].itemstyle = itemstyle;
    
    this.setData({
      list: addList
    });
    addList.splice(index, 1);
    // 从获取的下标开始，删除数组中的一个元素
    setTimeout(function () { 
      
      that.setData({
        list: addList
      });
      wx.setStorage({
        key: 'edit',
        data: that.data.list,
      });
     },600);
    
    // 重新加载这个页面
    // wx.reLaunch({
    //   url: '../home/home',
    // });
  },
  clickItem: function(e){
    // 获取当前点击项的下标
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../detail/detail?index='+index,
    });
  }
})
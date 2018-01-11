// pages/detail/detail.js
Page({
  /* 页面的初始数据 */
  data: {
    list: [],
    index: '',
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this;
    var addList = this.data.list;
    // 获取从首页传过来的参数并转成number格式
    var index = Number(options.index);
    // 通过index从本地缓存中获取到需要渲染的数据
    wx.getStorage({
      key: 'edit',
      success: function(res) {
        addList.push(res.data[index]);
        that.setData({
          list: addList,
          index: index
        });
      },
    });
  },
  binddel: function(e){
    var that = this;
    wx.getStorage({
      key: 'edit',
      success: function (res) {
        // 将缓存中所有的数据，全部取出来并存入变量addList中
        var addList = res.data;
        // 利用首页传过来的index，删除addList中index对应的元素
        addList.splice(that.data.index, 1);
        // 将删除一个元素后的addList存入缓存中，覆盖原来的缓存
        wx.setStorage({
          key: 'edit',
          data: addList,
        });
        // 关闭所有页面，回到首页
        wx.reLaunch({
          url: '../home/home',
        })
      },
    });
  },
  bindedit: function(e){
    var that = this;
    // 思路：点击的时候关闭当前页带着首页传过来的index直接进入下一页
    // console.log(this.data.index);
    wx.redirectTo({
      url: '../edit/edit?index=' + this.data.index,
    })
  }
})
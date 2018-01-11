// pages/edit/edit.js
Page({
  data: {
    list: [],
    editlist: [],
    index: '',
  },
  onLoad: function(options){
    var that = this;
    var index = options.index;
    if(index){
      wx.getStorage({
        key: 'edit',
        success: function(res) {
          var addList = that.data.editlist;
          addList.push(res.data[index]);
          // 利用详情页传递过来的参数获取到当前编辑的这条数据，然后传入页面中一个新的字段里，页面检查这个字段有无参数，然后渲染
          that.setData({
            editlist: addList,
            index: index
          });
        },
      })
    };
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'edit',
      success: function (res) {
        var i;
        for (i = 0; i < res.data.length; i++) {
          that.data.list.unshift(res.data[i]);
        };
      },
    });
  },
  // 点击提交按钮执行这个函数，提交整个表单的内容
  formSubmit: function(event){
    var index = this.data.index;
    console.log(index);
    var addList = this.data.list;
    // 获取当前的时间
    var ndata = new Date();
    var houre = ndata.getHours();
    var minutes = ndata.getMinutes();
    // 判断当前的小时或分钟数是否小于10，如果小于10，则在前面加上0
    function judge(timer){
      if(timer<10){
        timer = '0'+timer;
      }
      return timer;
    };
    minutes = judge(minutes);
    houre = judge(houre);
    // 初始化一个空对象
    var nobject = new Object();
    // 将输入的内容和时间作为对象属性传入
    nobject.title = event.detail.value.title;
    nobject.content = event.detail.value.continer;
    nobject.yearmonth = ndata.getFullYear() + "年" + ndata.getMonth() + 1 + "月" + ndata.getDate() + "日";
    nobject.time = houre + ":" + minutes;
    nobject.sort = addList.length + 1;
    console.log(nobject.sort);
    if (event.detail.value.title && event.detail.value.continer){
      // 将这个对象存入到本地缓存
      if(index){
        index = Number(index);
        // addList.splice(index,1,nobject); 
        addList.splice(index,1);
        addList.unshift(nobject);
      }else{
        addList.unshift(nobject);
      };
      var compare = function (obj1, obj2) {
        var val1 = obj1.sort;
        var val2 = obj2.sort;
        if (val1 > val2) {
          return -1;
        } else if (val1 < val2) {
          return 1;
        } else {
          return 0;
        }
      };
      addList = addList.sort(compare);
      wx.setStorage({
        key: 'edit',
        data: addList,
      });
      wx.navigateTo({
        url: '../home/home',
      });
    }else{
      wx.showToast({
        title: '想法不完整',
        icon: 'loading',
        image: '../../../common/image/note.png',
      });
    };
  },
})
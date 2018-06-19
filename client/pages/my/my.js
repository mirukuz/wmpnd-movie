// pages/collection/collection.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    collectionList: [],
    publishedList: [],
  },

  navToReviewDetail(e) {
    let reviewId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/reviewDetail/reviewDetail?id=${reviewId}`,
    })
  },

  //播放声音
  playRecording(e) {
    let path = e.currentTarget.dataset.path

    innerAudioContext.autoplay = true
    innerAudioContext.src = path,
      innerAudioContext.onPlay(() => {
        console.log('开始播放', innerAudioContext.src)
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  getMyList() {
    wx.showLoading({
      title: '刷新收藏数据...',
    })

    qcloud.request({
      url: config.service.myList,
      login: true,
      success: result => {
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          let collectionList = data.data.collection
          let publishedList = data.data.published
          collectionList.forEach(d =>
            d.content && d.content.length > 40
              ? d.content = `${d.content.substring(0, 40)}...`
              : d.content)
          publishedList.forEach(d =>
            d.content && d.content.length > 40
            ? d.content = `${d.content.substring(0, 40)}...`
            : d.content)
          this.setData({
            collectionList: collectionList,
            publishedList: publishedList
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '数据刷新失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '数据刷新失败',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        this.getMyList()
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
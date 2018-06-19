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
    isPlaying: null,
  },

  /**
   * 跳转影评详情
   */
  navToReviewDetail(e) {
    let reviewId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/reviewDetail/reviewDetail?id=${reviewId}`,
    })
  },

  /**
   * 播放语音影评
   */
  playRecording(e) {
    let path = e.currentTarget.dataset.path
    let id = e.currentTarget.dataset.id

    innerAudioContext.autoplay = true
    innerAudioContext.src = path,
    innerAudioContext.onPlay(() => {
      this.setData({
        isPlaying: id
      })
    })
    innerAudioContext.onEnded(() => {
      this.setData({
        isPlaying: null
      })
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      wx.showToast({
        icon: 'none',
        title: '影评播放失败',
      })
    })
  },

  /**
   * 获取我的列表
   */
  getMyList(callback) {
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
          // 截取影评前40个字符
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
      },
      complete: () => {
        callback && callback()
      }
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getMyList(() => {
      wx.stopPullDownRefresh()
    })
  }
})
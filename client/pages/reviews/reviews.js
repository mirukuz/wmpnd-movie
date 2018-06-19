// pages/reviews/reviews.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const innerAudioContext = wx.createInnerAudioContext()
const _ = require('../../utils/util')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    reviewList: [],
    isPlaying: null
  },

  backToHome() {
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },

  /**
   * 如果影评是录音，点击播放录音
   */
  playRecording(e) {
    let id = e.currentTarget.dataset.id
    let path = e.currentTarget.dataset.path

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
   * 跳转影评详情页面
   */
  navToReviewDetail(e) {
    let reviewId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/reviewDetail/reviewDetail?id=${reviewId}`,
    })
  },

  /**
   * 获取影评列表
   */
  getReviewList(callback) {
    qcloud.request({
      url: config.service.reviewList + this.data.movie.id,
      success: result => {
        let data = result.data
        if (!data.code) {
          this.setData({
            reviewList: data.data
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '影评列表加载错误',
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movie: {
        id: options.id,
        title: options.title,
        image: options.image
      }
    }, () => this.getReviewList())
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getReviewList(() => {
      wx.stopPullDownRefresh()
    })
  }
})
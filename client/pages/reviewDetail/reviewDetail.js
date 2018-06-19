// pages/reviewDetail/reviewDetail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewDetail: null,
    showBottomButton: false,
    isPlaying: false
  },

  /**
   * 播放语音影评
   */
  playRecording(e) {
    let path = e.currentTarget.dataset.path

    innerAudioContext.autoplay = true
    innerAudioContext.src = path,
    innerAudioContext.onPlay(() => {
      this.setData({
        isPlaying: true
      })
    })
    innerAudioContext.onEnded(() => {
      this.setData({
        isPlaying: false
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
   * 加入影评收藏
   */
  addToCollection() {
    wx.showLoading({
      title: '正在添加到收藏...',
    })

    qcloud.request({
      url: config.service.addCollection,
      login: true,
      method: 'PUT',
      data: this.data.reviewDetail,
      success: result => {
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          wx.showToast({
            title: '已添加到收藏',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '添加到收藏失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '添加到收藏失败',
        })
      }
    })

  },

  /**
   * 显示添加影评选项层
   */
  showModal() {
    this.setData({
      showBottomButton: true
    })
  },

  /**
   * 隐藏添加影评选项层
   */
  hideModal() {
    this.setData({
      showBottomButton: false
    })
  },

  /**
   * 跳转到影评编辑页面
   */
  navToEditReview(e) {
    let reviewDetail = this.data.reviewDetail
    let id = e.currentTarget.dataset.id || reviewDetail.movie_id
    let type = e.currentTarget.dataset.type
    console.log('type', type)
    wx.navigateTo({
      url: `/pages/editReview/editReview?id=${id}&type=${type}&title=${reviewDetail.title}&image=${reviewDetail.image}`,
    })
  },

  /**
   * 获取影片详情
   */
  getReviewDetail(id) {
    wx.showLoading({
      title: '影评详情加载中...',
    })

    qcloud.request({
      url: config.service.reviewDetail + id,
      success: result => {
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          this.setData({
            reviewDetail: data.data
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: () => {
        wx.hideLoading()

        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReviewDetail(options.id)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      showBottomButton: false
    })
  }
})
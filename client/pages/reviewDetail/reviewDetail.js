// pages/reviewDetail/reviewDetail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: null,
    reviewDetail: null,
  },

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

  showModal() {
    this.setData({
      showBottomButton: true
    })
  },

  hideModal() {
    this.setData({
      showBottomButton: false
    })
  },

  navToEditReview(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/editReview/editReview?id=' + id,
    })
  },

  getReviewDetail(id) {
    wx.showLoading({
      title: '影评详情加载中...',
    })

    qcloud.request({
      url: config.service.reviewDetail + id,
      success: result => {
        wx.hideLoading()

        let data = result.data
        console.log(data);

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

  navToEditReview() {
    let movie = this.data.movie
    wx.navigateTo({
      url: `/pages/editReview/editReview?id=${movie.id}&title=${movie.title}&image=${movie.image}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movie: {
        title: options.title,
        image: options.image,
        id: options.id
      }
    })
    this.getReviewDetail(options.id)
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
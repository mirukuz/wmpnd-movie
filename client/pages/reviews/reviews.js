// pages/reviews/reviews.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const _ = require('../../utils/util')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    reviewList: [],
  },

  backToHome() {
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },

  navToReviewDetail(e) {
    let reviewId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/reviewDetail/reviewDetail?id=${reviewId}`,
    })
  },

  getReviewList(id) {
    qcloud.request({
      url: config.service.reviewList + id,
      success: result => {
        let data = result.data
        if (!data.code) {
          console.log('reviewList !!!', data.data)
          this.setData({
            reviewList: data.data.map(item => {
              let itemDate = new Date(item.create_time)
              item.createTime = _.formatTime(itemDate)
              // item.images = item.images ? item.images.split(';;') : []
              return item
            })
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReviewList(options.id)
    console.log('option',options)
    this.setData({
      movie: {
        id: options.id,
        title: options.title,
        image: options.image
      }
    })
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
// pages/home/home.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    recommendation: null,
  },

  /**
   * 点击电影海报跳转电影详情
   */
  onTapGetDetail(e) {
    let id = this.data.recommendation.review.movie_id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },

  /**
   * 点击推荐影评跳转影评详情
   */ 
  navToReviewDetail() {
    let reviewId = this.data.recommendation.review.id
    wx.navigateTo({
      url: `/pages/reviewDetail/reviewDetail?id=${reviewId}`,
    })
  },

  /**
   * 用户登录
   */
  onTapLogin() {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },

  /**
   * 跳转热门影片
   */
  navToPopular() {
    wx.navigateTo({
      url: '/pages/popular/popular',
    })
  },

  /**
   * 跳转我的列表
   */
  navToMyList() {
    wx.navigateTo({
      url: '/pages/my/my',
    })
  },

  /**
   * 获取影片推荐
   */
  getRecommendation(callback) {
    wx.showLoading({
      title: '加载中...',
    })

    qcloud.request({
      url: config.service.recommendation,
      success: result => {
        wx.hideLoading()

        let data = result.data
        console.log(data);

        if (!data.code) {
          this.setData({
            recommendation: data.data
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: () => {
        wx.hideLoading()
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
    this.getRecommendation()
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
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getRecommendation(() => {
      wx.stopPullDownRefresh()
    })
  }
})
// pages/detail/detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    showBottomButton: false
  },

  /**
   * 显示添加影评选项层
   */
  showModal () {
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
   * 跳转影评列表页面
   */
  navToReviewList() {
    let movie = this.data.movie;
    wx.navigateTo({
      url: `/pages/reviews/reviews?id=${movie.id}&title=${movie.title}&image=${movie.image}`,
    })
  },

  /**
   * 跳转编辑影评页面
   */
  navToEditReview(e) {
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type // 传入影评类型参数 content | voice， 分别跳转文字或者音频编辑页面
    let movie = this.data.movie
    wx.navigateTo({
      url: `/pages/editReview/editReview?id=${id}&title=${movie.title}&image=${movie.image}&type=${type}`,
    })
  },

  /**
   * 显示添加影评选项层
   */
  getMovie(id) {
    wx.showLoading({
      title: '电影数据加载中...',
    })

    qcloud.request({
      url: config.service.movieDetail + id,
      success: result => {
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          this.setData({
            movie: data.data
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
    this.getMovie(options.id)
  },

  /**
   * 生命周期函数--监听页面隐藏，这样从上个页面返回时不在影评编辑选项层的状态
   */
  onHide: function () {
    this.setData({
      showBottomButton: false
    })
  }
})
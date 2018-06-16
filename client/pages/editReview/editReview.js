// pages/editReview/editReview.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    review: '',
    ready: false,
    userInfo: null,
  },

  enterEditMode() {
    this.setData({
      ready: false
    })
  },

  publishReview(event) {
    let content = this.data.review
    if (!content) return

    wx.showLoading({
      title: '正在发表影评'
    })

    qcloud.request({
      url: config.service.addReview,
      login: true,
      method: 'POST',
      data: {
        content,
        movie_id: this.data.movie.id
      },
      success: result => {
        wx.hideLoading()

        let data = result.data
        console.log('data',data)

        if (!data.code) {
          wx.showToast({
            title: '发表影评成功'
          })

          setTimeout(() => {
            let id = event.currentTarget.dataset.id
            console.log(id)
            wx.navigateTo({
              url: '/pages/reviews/reviews?id=' + id,
            })
          }, 1500)
        } else {
          wx.showToast({
            icon: 'none',
            title: '发表影评失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '发表评论失败'
        })
      }
    })
  },

  bindFormSubmit: function (e) {
    const review = e.detail.value.review
    this.setData({
      review: review,
      ready: true
    })
  },

  getMovie(id) {
    wx.showLoading({
      title: '加载影评功能中...',
    })

    qcloud.request({
      url: config.service.movieDetail + id,
      success: result => {
        wx.hideLoading()

        let data = result.data
        console.log(data);

        if (!data.code) {
          this.setData({
            movie: data.data
          })
          console.log('$$$$$', this.data.movie)
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
    this.getMovie(options.id);
    app.checkSession({
      success: ({ userInfo }) => {
        console.log('userInfo', userInfo)
        this.setData({
          userInfo
        })
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
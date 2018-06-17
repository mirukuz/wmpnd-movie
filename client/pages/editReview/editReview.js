// pages/editReview/editReview.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()
let tempFilePath;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    review: '',
    ready: false,
    userInfo: null,
    type: 'text',
    filePath: null,
    isSpeaking: false,
  },

  uploadRecord() {
    let recordPath = this.data.filePath
    if (recordPath) {
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: recordPath,
        header: {
          'content-type': 'multipart/form-data'
        },
        name: 'file',
        success: res => {
          let data = JSON.parse(res.data)
          console.log('recordPath', data)
          // if (!data.code) {
          //   console.log(data)
          // }
        }
      })
    }
  },

  //开始录音的时候
  touchdown () {
    this.setData({
      isSpeaking: true
    })
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('录音开始')
    });

    setTimeout(() => {
      //结束录音  
      this.stopRecording()
    }, 10000)
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },

  touchup: function () {
    console.log("手指抬起了...")
    this.stopRecording()
  },
  //停止录音
  stopRecording () {
    this.setData({
      isSpeaking: false
    })
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
      this.setData({
        filePath: tempFilePath,
      })
    })
  },
  //播放声音
  playRecording () {

    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.filePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放', innerAudioContext.src )
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },

  enterEditMode() {
    this.setData({
      ready: false
    })
  },

  publishReview(event) {
    let content = this.data.review

    wx.showLoading({
      title: '正在发表影评'
    })
    // this.uploadRecord()

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
            let movie = this.data.movie;
            wx.navigateTo({
              url: `/pages/reviews/reviews?id=${movie.id}&title=${movie.title}&image=${movie.image}`,
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
    if (review) {
      this.setData({
        review: review,
        ready: true
      })
    } else {
      this.setData({
        ready: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movie: {
        title: options.title,
        image: options.image,
        id: options.id,
      },
      type: options.type
    })
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
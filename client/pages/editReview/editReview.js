// pages/editReview/editReview.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
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
    type: 'text',
    filePath: null, // 录音暂存地址
    isSpeaking: false,
    isPlaying: false
  },

  uploadRecord(cb) {
    let recordPath = this.data.filePath
    let record
    if (recordPath) {
      wx.showLoading({
        title: '正在上传录音'
      })
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: recordPath,
        name: 'file',
        success: res => {
          let data = JSON.parse(res.data)

          if (!data.code) {
            wx.hideLoading();
            record = data.data.imgUrl
          }
          console.log('返回来的录音存储地址', record)

          wx.showLoading({
            title: '正在发表影评'
          })
          // 回调韩式返回录音地址
          cb && cb(record)
        }
      })
    } else {
      cb && cb(record)
    }
  },

  /**
   * 按住开始录音
   */
  touchdown () {
    this.setData({
      isSpeaking: true
    })
    const options = {
      duration: 10000,// 指定录音的时长，单位 ms
      sampleRate: 16000,// 采样率
      numberOfChannels: 1,// 录音通道数
      encodeBitRate: 96000,// 编码码率
      format: 'mp3',// 音频格式，有效值 aac/mp3
      frameSize: 50,// 指定帧大小，单位 KB
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

  /**
   * 松开停止录音
   */
  touchup: function () {
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
        filePath: tempFilePath, // 存储在文件暂存地址
      })
    })
  },

  /**
   * 播放录音
   */
  playRecording () {

    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.filePath,
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
        title: '影评播放失败'
      })
    })
  },

  /**
   * 进入编辑模式
   */
  enterEditMode() {
    this.setData({
      ready: false
    })
  },

  /**
   * 发表影评
   */
  publishReview(event) {
    let content = this.data.review
    if (content) {
      wx.showLoading({
        title: '正在发表影评'
      })
    }

    this.uploadRecord(record => {

      qcloud.request({
        url: config.service.addReview,
        login: true,
        method: 'POST',
        data: {
          content,
          record: record,
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
            title: '发表影评失败'
          })
        }
      })
    })
  },

  /**
   * 进入预览模式
   */
  enterPreviewMode: function (e) {
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
    console.log('options', options)
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
  }
})
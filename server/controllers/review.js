const DB = require('../utils/db')

module.exports = {

  /**
   * 添加评论
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let movieId = ctx.request.body.movie_id
    let content = ctx.request.body.content || null

    let voice = ctx.request.body.voice || null


    if (!isNaN(movieId)) {
      await DB.query('INSERT INTO review(user, username, avatar, content, voice, movie_id) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, content, voice, movieId])
    }

    ctx.state.data = {}
  },

  /**
   * 获取评论列表
   */
  list: async ctx => {
    let movieId = ctx.params.id

    if (!isNaN(movieId)) {
      ctx.state.data = await DB.query('SELECT * FROM review WHERE movie_id = ?', movieId)
    } else {
      ctx.state.data = []
    }
  },

  /**
   * 获取影评详情
   */
  detail: async ctx => {
    let id = ctx.params.id
    ctx.state.data = (await DB.query('SELECT * FROM review WHERE id = ?', id))[0]
  },
}
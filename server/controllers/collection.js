const DB = require('../utils/db');

module.exports = {
  /**
   * 添加到收藏列表
   * 
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let review = ctx.request.body

    await DB.query('INSERT INTO collection_user(id, user) VALUES (?, ?)', [review.id, user])

    ctx.state.data = {}
  },

  /**
   * 获取收藏列表
   * 
   */
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    ctx.state.data = await DB.query('SELECT collection_user.id, review.avatar, review.content, review.username, review.movie_id, movies.title, movies.image FROM collection_user RIGHT JOIN review ON collection_user.id = review.id RIGHT JOIN movies ON review.movie_id = movies.id WHERE collection_user.user = ?', [user])
  },
}
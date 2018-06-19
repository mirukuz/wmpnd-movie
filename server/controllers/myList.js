const DB = require('../utils/db');

module.exports = {
  /**
   * 获取收藏列表
   * 
   */
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    const collection = await DB.query('SELECT collection_user.id, review.avatar, review.content, review.voice, review.username, review.movie_id, movies.title, movies.image FROM collection_user RIGHT JOIN review ON collection_user.id = review.id RIGHT JOIN movies ON review.movie_id = movies.id WHERE collection_user.user = ?', [user])

    const published = await DB.query('SELECT review.id, review.avatar, review.content, review.voice, review.username, review.movie_id, movies.title, movies.image FROM review RIGHT JOIN movies ON review.movie_id = movies.id WHERE review.user = ?', [user])

    ctx.state.data = { collection, published }
  }
}
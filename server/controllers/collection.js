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
  }
}
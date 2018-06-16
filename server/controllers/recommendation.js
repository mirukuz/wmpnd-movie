const DB = require('../utils/db')

module.exports = {
  /**
   * 获取随机影评推荐
   */
  detail: async ctx => {
    const reviewList = await DB.query('SELECT id, avatar, username, movie_id FROM review')
    if (reviewList !== []){
      const randomNumber = Math.floor(Math.random() * reviewList.length)
      const review = reviewList[randomNumber]
      const movieId = review.movie_id
      const movie = (await DB.query('SELECT image, title FROM movies WHERE id = ?', movieId))[0]
      ctx.state.data = { review, movie }
    } else {
      ctx.state.data = {}
    }
  },
}
/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// 获取电影列表
router.get('/movie', controllers.movie.list)

// 获取电影详情
router.get('/movie/:id', controllers.movie.detail)

// 添加影评
router.post('/review', validationMiddleware, controllers.review.add)

// 获取影评列表
router.get('/review/:id', controllers.review.list)

// 获取影评详情
router.get('/review/detail/:id', controllers.review.detail)

// 获取首页推荐影片
router.get('/recommendation', controllers.recommendation.detail)

// 添加到用户收藏列表
router.put('/collection', validationMiddleware, controllers.collection.add)

// 获取用户的收藏和发表过的影评
router.get('/myList', validationMiddleware, controllers.myList.list)

module.exports = router

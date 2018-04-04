
const express = require('express')

const router = express.Router()   /* 使用创建模块化,可挂载的句柄 */
const login = require('./admin/login')
const image = require('./admin/image')
const user = require('./admin/user')
const admin = require('./admin/admin')
const category = require('./admin/category')

/* 自定义中间件,判断是否登录,只有login和doLogin不进行判断 */
router.use( (req, res, next) =>{

    if (req.url == '/login' || req.url == '/login/doLogin') {
        next()
    } else {
        if (req.session.userinfo && req.session.userinfo.username != '') {
            /**
             * app.locals 真正的全局
             * req.app.locals 请求的全局
             */
            req.app.locals['userinfo'] = req.session.userinfo;  /* ejs全局设置数据, 所有的ejs模板都能使用的数据 */
            next()
        } else {
            res.redirect('/admin/login')
        }
    }

})

router.use('/login', login)
router.use('/image', image)
router.use('/user', user)
router.use('/admin', admin)
router.use('/category', category)

module.exports = router




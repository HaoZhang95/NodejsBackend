
const express = require('express');
const router = express.Router();
const md5 = require('md5-node')
const DB = require('../../modules/db')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get('/', (req,res,next) =>{

    res.render('admin/login');

})

router.get('/logout', (req,res,next) =>{

    req.session.destroy( (err) =>{
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/login')
        }
    })
})

router.post('/doLogin', urlencodedParser, (req,res,next) =>{

    if (!req.body) {
        return res.sendStatus(400)
    }


    const username = req.body.username
    const password = md5(req.body.password)   /* 用户密码的加密存储到数据库 */

    DB.find('user', {
        username: username,
        password: password,
    }, (error, data) =>{
        if (data.length > 0) {
            req.session.userinfo = data[0]
            res.redirect('/admin/image')
        } else {
            res.send("<script> alert('login failed, Please check your password.'); location.href='/admin/login'</script>")
        }
    })

})

module.exports = router
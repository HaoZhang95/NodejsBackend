
const express = require('express')

const router = express.Router()

const DB = require('../../modules/db')


//登录
router.get('/',(req,res) =>{

    DB.find('user',{status: 1}, (error, data) =>{
        if (error) {
            console.log(error);
            return;
        }

        res.render('admin/admin/index', {
            list: data
        });
    })

})

router.get('/delete',(req,res) =>{

    const id = req.query.id;

    /* 利用id去数据库查找, 自增长的id要用DB.ObjectID(id)来获取数据化的id来匹配 */
    DB.delete('user', {
        "_id": new DB.ObjectID(id),
    },  (error, data) =>{

        if (! error) {
            res.redirect('/admin/admin')
        }

    })

})

router.get('/add',(req,res) =>{

    res.send('Sorry, Pretend this is a page to add new administrator. :)')

})

router.get('/edit',(req,res) =>{

    res.send('Sorry, Pretend this is a page to update administrator info. :)')

})

module.exports = router
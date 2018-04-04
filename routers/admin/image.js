
const express = require('express')
const router = express.Router()
const multiparty = require('multiparty')
const DB = require('../../modules/db')
const fs = require("fs")

router.get('/',  (req, res) =>{

    DB.find('image',{}, (error, data) =>{
        if (error) {
            console.log(error);
            return;
        }

        res.render('admin/image/index', {
            list: data
        });
    })

})


router.get('/add',(req,res) =>{

    res.render('admin/image/add');

})

/**
 * 获取表单提交的数据和上传的图片
 */
router.post('/doimageAdd',(req,res) =>{

    const form = new multiparty.Form()

    form.uploadDir = 'uploads'      /* 上传的文件夹必须存在 */

    form.parse(req,  (error, textFields, files) =>{
        console.log(textFields);
        console.log(files);

        const title = textFields.title[0]
        const category = textFields.category[0]
        // const author =
        const desc = textFields.desc[0]
        const pic = files.pic[0].path

        DB.insert('image', {
            title: title,
            category:category,
            desc: desc,
            pic: pic,
        },  (error, data) =>{
            if (! error) {
                res.redirect('/admin/image')
            }
        })
    })

})



router.get('/edit',(req,res) =>{

    const id = req.query.id;

    /* 利用id去数据库查找, 自增长的id要用DB.ObjectID(id)来获取数据化的id来匹配 */
    DB.find('image', {
        "_id": new DB.ObjectID(id),
    },  (error, data) =>{

        res.render('admin/image/edit', {
            list: data[0]
        });
    })
})

router.post('/doimageEdit',(req,res) =>{

    const form = new multiparty.Form()

    form.uploadDir = 'uploads'      /* 上传的文件夹必须存在 */

    form.parse(req,  (error, textFields, files) =>{
        console.log(textFields);
        console.log(files);

        const id = textFields.id[0]  /* 接受的id保存在隐藏的hidden的input中 */

        const title = textFields.title[0]
        const category = textFields.category[0]
        const desc = textFields.desc[0]
        const pic = files.pic[0].path

        const originalFileName = files.pic[0].originalFilename

        if (originalFileName){
            const setData = {     /* 重新上传图片 */
                title: title,
                category: category,
                desc: desc,
                pic: pic,
            }
        } else {
            const setData = {     /* 没有重新上传图片 */
                title: title,
                category: category,
                desc: desc,
            }

            /*删除临时生成的图片*/
            fs.unlink(pic)
        }

        DB.update('image', {
            "_id": new DB.ObjectID(id),
        },setData,  (error, data) =>{
            if (! error) {
                res.redirect('/admin/image')
            }
        })
    })


})



router.get('/delete',(req,res) =>{

    const id = req.query.id;

    /* 利用id去数据库查找, 自增长的id要用DB.ObjectID(id)来获取数据化的id来匹配 */
    DB.delete('image', {
        "_id": new DB.ObjectID(id),
    },  (error, data) =>{

        if (! error) {
            res.redirect('/admin/image')
        }

    })

})


module.exports = router
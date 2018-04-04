
const express = require('express')
const router = express.Router()
const multiparty = require('multiparty')
const DB = require('../../modules/db')
const fs = require("fs")

router.get('/',  (req, res) =>{

    DB.find('category',{}, (error, data) =>{
        if (error) {
            console.log(error);
            return;
        }

        console.log(data);

        // res.render('admin/image/index', {
        //     list: data
        // });
    })

})

router.get('/:categoryId',  (req, res) =>{

    console.log(req.params);
    const categoryId = req.params.categoryId
    var _id;

    try {
        _id = DB.ObjectID(categoryId)

        DB.find('category',{_id: _id}, (error, data) =>{
            if (error) {
                return res.status(500).json({
                    message:'Get category failed, cause database connection.'
                })
            }

            if(data.length <= 0){
                res.status(500).json({
                    message:'Category id is missing or incorrect.'
                })
            } else {
                console.log(data);
                res.status(200).json({
                    message:'Get category sucessfully.',
                    category: {
                        _id: data[0]['_id'],
                        name: data[0]['name']
                    }
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message:'Format of category id is incorrect.'
        })
    }

})




router.delete('/delete/:categoryId',(req,res) =>{

    console.log(req.body);
    console.log(req.params);
    const categoryId = req.params.categoryId
    var _id;

    try {
        _id = DB.ObjectID(categoryId)

        DB.find('category',{_id: _id}, (error, data) =>{
            if (error) {
                return res.status(500).json({
                    message:'Category delete failed, cause database connection.'
                })
            }

            if(data.length <= 0){
                res.status(500).json({
                    message:'Category id is missing or incorrect.'
                })
            } else {
                DB.delete('category', {
                    "_id": _id
                }, (error, data) => {
                    if (error) {
                        res.status(500).json({
                            message:'Category delete failed.'
                        })
                    } else {
                        res.status(200).json({
                            message:'Category delete sucessfully'
                        })
                    }

                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message:'Format of image id is incorrect.'
        })
    }
})

router.post('/edit',(req,res) =>{

    console.log(req.body);
    const newName = req.body.name
    const categoryId = req.body.categoryId
    var _id;

    try {
        _id = DB.ObjectID(categoryId)

        DB.find('category',{_id: _id}, (error, data) =>{
            if (error) {
                return res.status(500).json({
                    message:'Category delete failed, cause database connection.'
                })
            }

            if(data.length <= 0){
                res.status(500).json({
                    message:'Category id is missing or incorrect.'
                })
            } else {

                const setData = {
                    name: newName
                }
                DB.update('category', {
                    "_id": new DB.ObjectID(id),
                },setData,  (error, data) =>{
                    if (error) {
                        res.status(500).json({
                            message:'Category update failed.'
                        })
                    } else {
                        res.status(200).json({
                            message:'Category update sucessfully'
                        })
                    }
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message:'Format of image id is incorrect.'
        })
    }


})

module.exports = router
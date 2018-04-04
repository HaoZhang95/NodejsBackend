

const express = require('express')

const router = express.Router()   /* 使用创建模块化,可挂载的句柄 */

router.get('/', (req, res) =>{
    res.send("Welcome to backend of Team 3. Please use proper api to get needed json. :)")
})

module.exports = router


const express = require('express')

const router = express.Router()   /* 使用创建模块化,可挂载的句柄 */

router.get('/', (req, res) =>{
    res.send("<h2>Welcome to backend of Team 3. Please use proper api to get needed json. :) </h2>" +
        "<h4><br>Project Members (No Order):  Hao Zhang , Mikael Rämö , Emma Honkala , Long Nguyen</h4>")
})

module.exports = router
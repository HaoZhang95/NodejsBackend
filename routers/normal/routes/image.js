
const express = require('express')
const router = express.Router()
const imageController= require('../controllers/imageController');

const checkAuth = require('../../../middleware/check-auth')

/**
 * 获取表单提交的数据和上传的图片
 */
router.post('/',checkAuth, imageController.doUpload)

router.delete('/:imageId',checkAuth, imageController.doImageDelete)

router.get('/:userId',checkAuth, imageController.getImagesByUserId)

module.exports = router
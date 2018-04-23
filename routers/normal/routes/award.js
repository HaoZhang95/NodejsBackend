
const express = require('express')
const router = express.Router()
const awardController= require('../controllers/awardController');

const checkAuth = require('../../../middleware/check-auth')

router.put('/', checkAuth,awardController.updatePoints)

module.exports = router

const express = require('express');
const router = express.Router();
const checkAuth = require('../../../middleware/check-auth')
const categoryController = require('../controllers/categoryController');

router.get('/',categoryController.getAllCategories);

router.get('/:categoryId', categoryController.getCategoryById);

module.exports=router;

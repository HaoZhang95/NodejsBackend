
const express = require('express');
const router= express.Router();
const checkAuth= require('../../../middleware/check-auth')
const UserController= require('../controllers/userController');

router.post('/signup',UserController.userSignup);

router.post('/login',UserController.userLogin);

router.delete('/:userId',checkAuth,UserController.userDelete);

router.get('/:userId',checkAuth, UserController.getUserInfoById);

router.put('/',checkAuth, UserController.updateUsername);

router.get('/', UserController.getAllUsers)

module.exports=router;

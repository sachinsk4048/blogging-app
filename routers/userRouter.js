// routers\userRouter.js

const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, accessRole } = require('../middlewares/authMiddleware');
const validate= require('../middlewares/validateMiddleware');
const { signupSchema, loginSchema } = require('../validator/userValidator');
const refreshController = require('../controllers/refreshController');


userRouter.get('/',userController.getIndex);
userRouter.post('/signup',validate(signupSchema),userController.postSignup);
userRouter.get('/verify/:token',userController.verifyEmail)
userRouter.post('/login',validate(loginSchema),userController.postLogin);
userRouter.post('/logout',userController.getLogout);
userRouter.get('/profile',authMiddleware,userController.getProfile);
userRouter.get('/admin',authMiddleware,accessRole(['admin']),userController.getProfile);
userRouter.get('/refresh',refreshController.refreshToken);
module.exports = userRouter;

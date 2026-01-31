// routers\userRouter.js
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */



const express = require('express');
const userRouter = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const { authMiddleware, accessRole } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { signupSchema, loginSchema, resetPasswordSchema, editProfileSchema, createPostSchema, commentSchema } = require('../validator/userValidator');
const refreshController = require('../controllers/refreshController');
const upload = require('../middlewares/multer');

const passport = require("../config/oAuth");
const { googleCallback } = require("../controllers/oAuthController");

userRouter.get('/auth/google', passport.authenticate("google", {
    scope: ["profile", "email"]
}))
userRouter.get('/auth/google/callback',passport.authenticate("google", {
        session: false
    }),
    googleCallback );


userRouter.post('/signup', validate(signupSchema), authController.postSignup);
userRouter.get('/verify/:token', authController.verifyEmail);
userRouter.post('/forgetPassword', authController.postForgetPassword);
userRouter.post('/resetPassword/:token', validate(resetPasswordSchema), authController.postResetPassword);
userRouter.post('/login', validate(loginSchema), authController.postLogin);
userRouter.post('/logout', authController.getLogout);

userRouter.get('/', userController.getIndex);
userRouter.get('/post/:id', userController.getSinglePost);
userRouter.post('/post/:id/like', authMiddleware, userController.postLikePost);
userRouter.post('/post/:id/unlike', authMiddleware, userController.postUnlikePost);
userRouter.post('/post/:id/comment', authMiddleware, validate(commentSchema), userController.postComment);
userRouter.post('/post/:id/uncomment', authMiddleware, userController.postUncomment);
userRouter.get('/post/:id/comment', userController.getComments)

userRouter.post('/user/editProfile', authMiddleware, validate(editProfileSchema), userController.postEditProfile);
userRouter.post('/user/updateAvatar', authMiddleware, upload.single('avatar'), userController.postUploadAvatar)
userRouter.get('/profile', authMiddleware, userController.getViewProfile);
userRouter.post('/user/createPost', authMiddleware, validate(createPostSchema), userController.postCreatePost);


userRouter.get('/admin', authMiddleware, accessRole(['admin']), userController.getViewProfile);
userRouter.get('/refresh', refreshController.refreshToken);

module.exports = userRouter;




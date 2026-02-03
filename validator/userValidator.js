// validator\userValidator.js

const joi = require('joi');

exports.signupSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(4).required(),
  role: joi.string()
})

exports.loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(4).required()
})


exports.resetPasswordSchema = joi.object({
  newPassword: joi.string()
    .min(4)
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "Password should be at least 4 characters long"
    }),
  confirmPassword: joi.any()
    .equal(joi.ref('newPassword'))
    .required()
    .messages({
      "any.only": "Confirm password does not match"
    })
});

exports.editProfileSchema = joi.object({
  name: joi.string().min(3).max(30).optional(),
  phone: joi.string().pattern(/^[0-9]{10}$/).optional(),
  bio: joi.string().max(200).optional()
})

exports.createPostSchema = joi.object({
  postTitle: joi.string().min(3).max(30).required(),
  postDescription: joi.string().min(3).max(50).optional(),
  postContent: joi.string().min(3).required()
})

exports.commentSchema = joi.object({
  comment : joi.string().min(3).max(30).required(),
})
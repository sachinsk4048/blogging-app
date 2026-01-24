const joi = require('joi');

exports.signupSchema = joi.object({
    name:joi.string().min(3).max(30).required(),
    email:joi.string().email().required(),
    password:joi.string().min(4).required(),
    role:joi.string().required()
})

exports.loginSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(4).required()
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
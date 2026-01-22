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
// models\userModel.js

const { string } = require('joi');
const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null
    },

    bio: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return this.provider === "local";
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    avatar: {
        type: String,
        default: null,
    },

    //oAuth fields
    provider: {
        type: String,
        default: "local"
    },
    providerId: String,



    //  Email verification fields
    isVerified: {
        type: Boolean,
        default: false
    },
    emailToken: {
        type: String
    },
    emailTokenExpire: {
        type: Date
    },

    // reset password
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpire: {
        type: Date
    }


}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
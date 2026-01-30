// utils/token.js

const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" } // access token life
    );
};

exports.generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id
        },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" } // refresh token life
    );
};

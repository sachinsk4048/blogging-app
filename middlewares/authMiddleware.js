// middlewares\authMiddleware.js

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.authMiddleware = async (req, res, next) => {
    try {

        const accessToken = req.cookies.accessToken || req.headers["authorization"]?.split(" ")[1];
        if (!accessToken) {
            return res.status(401).send({ message: 'unauthorize !token' });
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).send({ message: 'unauthorize  !user' });
        }

        req.user = user;
        next();
    } catch {
        return res.status(401).send({ message: 'unauthorize  tryyyyy' });
    }
}



exports.accessRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).send({ message: "Forbidden: Access denied" });
        }
        next();
    };
};

exports.isbanned = (req, res, next) => {
    if (req.user.isbanned) {
        return res.status(403).json({
            message: "Your account has been banned by admin"
        });
    }
    next();
}

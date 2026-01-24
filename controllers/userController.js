// controller/userController

const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');     //core module of nodejs
const sendEmail = require('../utils/sendEmail');
const { resetPasswordSchema } = require('../validator/userValidator');


exports.getIndex = async (req, res) => {         //it display all the users on index page
    try {
        const allUsers = await User.find();
        return res.status(200).json(allUsers);
    } catch {
        return res.status(500).json({ message: "something wnt wrong" });
    }
}

exports.postSignup = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        // check user exist
        const isExist = await User.findOne({ email });
        if (isExist) {
            return res.status(409).send({ message: "User already exist" });
        }
        // hash password
        const hash = await bcrypt.hash(password, 10);
        // create user
        const user = await User.create({ name, email, password: hash, role });
        // create email token
        const emailToken = crypto.randomBytes(32).toString("hex");
        user.emailToken = emailToken;
        user.emailTokenExpire = Date.now() + 15 * 60 * 1000; // 15 min
        await user.save();
        // create verify URL
        const verifyURL = `${process.env.SERVER_URL}/verify/${emailToken}`;
        // send email
        await sendEmail({
            email: user.email,
            subject: "Email Verification",
            message: `
                <h3>Hello ${user.name}</h3>
                <p>Please verify your email by clicking below link:</p>
                <a href="${verifyURL}">${verifyURL}</a>
            `
        });
        // response
        return res.status(201).send({
            message: "Signup successful! Please verify your email."
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

//emailverfication controller 
exports.verifyEmail = async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({
            emailToken: token,
            emailTokenExpire: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).send({ message: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.emailToken = undefined;
        user.emailTokenExpire = undefined;
        await user.save();
        return res.status(200).send({ message: "Email verified successfully, you can now login" });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}

exports.postForgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                message: "If this email exists, password reset link has been sent"
            });
        }

        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000;
        console.log('resetpassordToken : ',resetPasswordToken)
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordTokenExpire = resetPasswordTokenExpire;
        await user.save();

        const resetPasswordURL =
            `${process.env.SERVER_URL}/resetPassword/${resetPasswordToken}`;

        await sendEmail({
            email: user.email,
            subject: "Reset Password",
            message: `
        <h3>Hello ${user.name}</h3>
        <p>Reset your password by clicking below link:</p>
        <a href="${resetPasswordURL}">${resetPasswordURL}</a>
      `
        });

        return res.status(200).json({
            message: "If this email exists, password reset link has been sent"
        });

    } catch (err) {
        console.error("Forgot Password Error:", err);
        return res.status(200).json({
            message: "If this email exists, password reset link has been sent tryy"
        });
    }
};

exports.postResetPassword = async (req, res) => {
    try {
        const token = req.params.token;

        const { error } = resetPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const { newPassword } = req.body;
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully, please login."
        });

    } catch (err) {
        console.error("Reset Password Error:", err);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


exports.postLogin = async (req, res, next) => {
    try {


        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            console.log('user not found');
            return res.status(404).send({ message: 'user not found' });
        }
        if (!user.isVerified) {
            return res.status(401).send({ message: "Please verify your email first" });
        }
        const ismatch = await bcrypt.compare(password, user.password)
        if (!ismatch) {
            return res.status(404).send({ message: "Invalid credentials" })
        }
        const accessToken = await jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.ACCESS_SECRET, { expiresIn: "15m" })
        const refreshToken = await jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.REFRESH_SECRET, { expiresIn: "7d" })
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false
        })
        return res.status(200).send({ message: "login successfully", accessToken })
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.getLogout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "logout successfully" });
}

exports.getProfile = (req, res) => {
    const { name, email, role } = req.user;
    return res.status(200).send({ name, email, role });
}

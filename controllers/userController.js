// controller/userController

const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        const isExist = await User.findOne({ email })
        if (isExist) {
            return res.status(409).send({ message: "uer already exist" })
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hash, role });
        return res.status(201).send({ message: 'user created', user })
    } catch (err) {
        res.status(500).send({ err, message: "something went wrong" });
    }

}

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            console.log('user not found');
            return res.status(404).send({ message: 'user not found' });
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
        res.status(500).send({ err, message: "something went wrong" });
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

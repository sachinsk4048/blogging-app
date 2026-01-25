const User = require('../models/userModel');
const multer = require('multer');

exports.getIndex = async (req, res) => {         //it display all the users on index page
    try {
        const allUsers = await User.find();
        return res.status(200).json(allUsers);
    } catch {
        return res.status(500).json({ message: "something wnt wrong" });
    }
}

exports.getViewProfile = (req, res) => {
    const { name, email, role, avatar } = req.user;
    return res.status(200).send({ name, email, role, avatar });
}

exports.postUploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload an image"
            });
        }
        const avatarPath = req.file.path
        await User.findByIdAndUpdate(req.user._id, {
            avatar: avatarPath
        })
        return res.status(200).json({ message: "Avatar updated successfully", avatar: avatarPath })
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}
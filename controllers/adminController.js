const User = require('../models/userModel');

exports.banUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.isBanned) {
      return res.status(400).json({
        message: "User is already banned"
      });
    }

    user.isBanned = true;
    user.bannedAt = new Date();

    await user.save();

    return res.status(200).json({
      message: "User banned successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


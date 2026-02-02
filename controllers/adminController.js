const User = require('../models/userModel');
const Post = require('../models/postModel')
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


exports.unbanUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.isBanned) {
      return res.status(400).json({
        message: "User is already Unbanned"
      });
    }

    user.isBanned = false;
    user.bannedAt = null;

    await user.save();

    return res.status(200).json({
      message: "User Unbanned successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

exports.dashboardStats = async(req,res)=>{
  try{
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({isBanned : false})
    const totalBanUsers = await User.countDocuments({isBanned : true});
    const totalPosts = await Post.countDocuments();
    
    return res.status(200).json({
      totalUsers,
      activeUsers,
      totalBanUsers,
      totalPosts
    })
  }catch(error){
    return res.status(500).json({
      message: error.message
    });
  }
}
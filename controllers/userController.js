const User = require('../models/userModel');
const Post = require('../models/postModel');
const Like = require('../models/likeModel');
const Comment = require('../models/commentModel')
const multer = require('multer');

exports.getIndex = async (req, res) => {         //it display all the posts on index page
    try {
        const posts = await Post.find().populate("userId").sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (error) {
        return res.status(500).json({ message: "server error", error: error.message });
    }
}

exports.getSinglePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "post not available" })
        }
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.postLikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }
        const existingLike = await Like.findOne({ userId, postId });
        if (existingLike) {
            return res.status(400).json({ message: "post already like" })
        }
        await Like.create({ postId, userId });
        return res.status(201).json({ message: "Post liked successfully" });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

exports.postUnlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const existingLike = await Like.findOne({ userId, postId });
        if (!existingLike) {
            return res.status(400).json({ message: "You haven't liked this post" });
        }

        await Like.deleteOne({ userId, postId });

        return res.status(200).json({ message: "Post unliked successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

exports.postComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const { comment } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        await Comment.create({
            postId,
            userId,
            comment
        })
        return res.status(201).json({ message: "comment successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.postUncomment = async (req, res) => {
      try {
    const postId = req.params.id;
    const userId = req.user._id;

    // Check if comment exists
    const existingComment = await Comment.findOne({ userId, postId });
    if (!existingComment) {
      return res.status(400).json({ message: "You haven't commented on this post" });
    }

    // Delete comment
    await Comment.deleteOne({ userId, postId });

    return res.status(200).json({ message: "Comment removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


exports.getViewProfile = (req, res) => {
    const { name, email, role, avatar } = req.user;
    return res.status(200).send({ name, email, role, avatar });
}
exports.postEditProfile = async (req, res) => {
    try {
        const { name, phone, boi } = req.body;
        await User.findByIdAndUpdate(req.user._id, {
            name,
            phone,
            boi
        });
        return res.status(200).json({ message: "profile edit sucessfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

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

exports.postCreatePost = async (req, res) => {
    try {
        const { postTitle, postDescription, postContent } = req.body;
        const post = new Post({
            userId: req.user._id,
            userName: req.user.name,
            postTitle,
            postDescription,
            postContent
        })
        await post.save();
        return res.status(201).json({ message: 'post created successfully', post });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}
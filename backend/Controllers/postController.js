import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      author: {
        id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar,
        role: req.user.userType,
      },
      content: req.body.content,
      images: req.body.images || [],
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

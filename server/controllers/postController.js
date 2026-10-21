const Post = require('../models/Post');

const populatePost = query =>
  query
    .populate('userId', 'username email createdAt')
    .populate('comments.userId', 'username');

const listPosts = async (req, res) => {
  try {
    const posts = await populatePost(Post.find().sort({ createdAt: -1 }));
    res.json(posts);
  } catch (err) {
    console.error('listPosts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createPost = async (req, res) => {
  try {
    const content = req.body.content ? req.body.content.trim() : '';
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!content && !imageUrl) {
      return res.status(400).json({ message: 'Post must contain text or an image' });
    }

    const post = new Post({
      userId: req.user.id,
      content,
      imageUrl
    });

    await post.save();
    await post.populate([
      { path: 'userId', select: 'username email' },
      { path: 'comments.userId', select: 'username' }
    ]);

    res.status(201).json(post);
  } catch (err) {
    console.error('createPost error:', err);
    res.status(500).json({ message: 'Server error creating post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post removed', postId: req.params.id });
  } catch (err) {
    console.error('deletePost error:', err);
    res.status(500).json({ message: 'Server error deleting post' });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.findIndex(id => id.toString() === req.user.id);
    if (index === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    console.error('toggleLike error:', err);
    res.status(500).json({ message: 'Server error toggling like' });
  }
};

const addComment = async (req, res) => {
  try {
    const content = req.body.content?.trim();
    if (!content) return res.status(400).json({ message: 'Comment cannot be empty' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ userId: req.user.id, content });
    await post.save();
    await post.populate('comments.userId', 'username');

    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    console.error('addComment error:', err);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};

module.exports = { listPosts, createPost, deletePost, toggleLike, addComment };

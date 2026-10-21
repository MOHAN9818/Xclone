const User = require('../models/User');

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id).select('-password');
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const currentUser = await User.findById(req.user.id).select('following');
    const isFollowing = currentUser
      ? currentUser.following.some(id => id.toString() === targetUser.id)
      : false;

    res.json({
      ...targetUser.toObject(),
      isFollowing
    });
  } catch (err) {
    console.error('getUserProfile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const listUsers = async (req, res) => {
  try {
    const [currentUser, users] = await Promise.all([
      User.findById(req.user.id).select('following'),
      User.find({ _id: { $ne: req.user.id } })
        .select('username email followers following createdAt')
        .sort({ username: 1 })
    ]);

    if (!currentUser) return res.status(404).json({ message: 'Current user not found' });

    const followingIds = new Set((currentUser.following || []).map(id => id.toString()));
    res.json(
      users.map(user => ({
        ...user.toObject(),
        isFollowing: followingIds.has(user.id),
        followersCount: (user.followers || []).length,
        followingCount: (user.following || []).length
      }))
    );
  } catch (err) {
    console.error('listUsers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleFollow = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(req.user.id),
      User.findById(req.params.id)
    ]);

    if (!currentUser) return res.status(404).json({ message: 'Current user not found' });
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const isFollowing = currentUser.following.some(id => id.toString() === targetUser.id);
    if (isFollowing) {
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      currentUser.following.addToSet(targetUser._id);
      targetUser.followers.addToSet(currentUser._id);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({
      following: !isFollowing,
      followersCount: targetUser.followers.length,
      followingCount: targetUser.following.length
    });
  } catch (err) {
    console.error('toggleFollow error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMe, getUserProfile, listUsers, toggleFollow };

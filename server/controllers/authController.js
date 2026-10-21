const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createTokenResponse = user => ({
  token: jwt.sign(
    { user: { id: user.id } },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  ),
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
    followersCount: (user.followers || []).length,
    followingCount: (user.following || []).length
  }
});

const signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    username = username ? username.trim() : '';
    email = email ? email.trim().toLowerCase() : '';

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json(createTokenResponse(user));
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email ? email.trim().toLowerCase() : '';

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json(createTokenResponse(user));
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { signup, login };

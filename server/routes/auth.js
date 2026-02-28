import express from 'express';
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { logActivity, asyncHandler } from '../middleware/logger.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register / Signup
router.post('/signup', asyncHandler(async (req, res) => {
  const { username, email, password, role = 'user', department = null } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email, and password' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: 'Email or username already in use' });
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    role,
    department: role === 'admin' ? department : null
  });

  // Log the signup
  await logActivity('LOGIN', `User signed up: ${username}`, user, 'user');

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    token,
    user: user.toJSON()
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if ((!username && !email) || !password) {
    return res.status(400).json({ message: 'Please provide email/username and password' });
  }

  // Check for user (need password field)
  const user = await User.findOne({
    $or: [{ username }, { email }]
  }).select('+password');

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check password
  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Log the login
  await logActivity('LOGIN', `${user.role} logged in: ${user.username}`, user, 'system');

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: user.toJSON()
  });
}));

// Get current user
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user.toJSON()
  });
});

// Logout (optional - frontend should clear token)
router.post('/logout', protect, asyncHandler(async (req, res) => {
  await logActivity('LOGOUT', `${req.user.role} logged out: ${req.user.username}`, req.user, 'system');

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// Get all users (admin only)
router.get('/users', protect, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can view all users' });
  }

  const users = await User.find({ role: 'user' }).select('-password');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
}));

// Update user (deactivate)
router.put('/users/:userId', protect, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can update users' });
  }

  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.userId, { isActive }, { new: true });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await logActivity('UPDATE', `Admin ${req.user.username} updated user ${user.username}`, req.user, 'user', user._id);

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user: user.toJSON()
  });
}));

export default router;

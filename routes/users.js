const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'yourSuperSecretKey';

// Get all users
router.get('/', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Get one user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

// Bulk insert users
router.post('/', async (req, res) => {
  try {
    const usersWithHashed = await Promise.all(req.body.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password || '123456', 10)
    })));
    const result = await User.insertMany(usersWithHashed);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update user (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    const update = req.body;
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
  } catch {
    res.status(400).json({ error: 'Invalid update or ID' });
  }
});

// Delete one user
router.delete('/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    result ? res.json({ message: 'User deleted' }) : res.status(404).json({ error: 'User not found' });
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// Delete all users
router.delete('/', async (req, res) => {
  await User.deleteMany({});
  res.json({ message: 'All users deleted' });
});

// Register (individual)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered' });
  } catch {
    res.status(400).json({ error: 'Email already used' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;

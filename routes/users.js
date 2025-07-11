const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validateUser = require('../utils/validateUser');

const SECRET = process.env.JWT_SECRET || 'yourSuperSecretKey'; // use env in production

// GET /users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide password
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

// POST /users - Bulk insert users
router.post('/', async (req, res) => {
  const usersArray = req.body;

  if (!Array.isArray(usersArray)) {
    return res.status(400).json({ error: 'Expected an array of users' });
  }

  try {
    const usersToInsert = await Promise.all(
      usersArray.map(async (user) => {
        if (!validateUser(user.name, user.email)) {
          throw new Error(`Invalid user data for ${user.email}`);
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { name: user.name, email: user.email, password: hashedPassword };
      })
    );

    const insertedUsers = await User.insertMany(usersToInsert);
    res.status(201).json({
      message: 'Users inserted successfully',
      insertedCount: insertedUsers.length,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Bulk insertion failed' });
  }
});

// POST /users/register - Register single user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!validateUser(name, email)) {
    return res.status(400).json({ error: 'Invalid user data' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered!' });
  } catch (error) {
    res.status(400).json({ error: 'Email already in use' });
  }
});

// POST /users/login - Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;

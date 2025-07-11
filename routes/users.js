const express = require('express');
const router = express.Router();
const validateUser = require('../utils/validateUser');

let users = [];

router.get('/', (req, res) => {
  res.json(users);
});

router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  user ? res.json(user) : res.status(404).json({ error: 'User not found' });
});

router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!validateUser(name, email)) {
    return res.status(400).json({ error: 'Invalid user data' });
  }

  const newUser = { id: Date.now().toString(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = 'yourSuperSecretKey'; // Should come from env vars in production

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered!' });
  } catch (error) {
    res.status(400).json({ error: 'Email already in use' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose'); // Make sure this is at the top
const app = express();
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/users');
const logger = require('./middleware/logger');

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to your Fantastic API!');
});

// ✅ MongoDB connection using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
})
.then(() => {
  console.log('✅ Connected to MongoDB');

  // Only start server if DB is connected
  app.listen(port, () => {
    console.log(`🔥 API is running on port ${port}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

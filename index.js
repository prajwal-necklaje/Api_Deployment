require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/users');
const logger = require('./middleware/logger');

app.use(express.json());
app.use(logger);            // Custom middleware
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to your Fantastic API!');
});

app.listen(port, () => {
  console.log(`🔥 API is running on port ${port}`);
});

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://prajwalmogra:9rwzWpzDX8bZhyJE@cluster0.0ubttmb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

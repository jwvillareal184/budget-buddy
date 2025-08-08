// 1. Core setup and config
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

// 2. Middleware
app.use(cors({
  origin: [
    'http://localhost:3002', // local React dev
    'https://budget-buddy-1-t2rh.onrender.com' // deployed frontend
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 3. Import route modules
const userRoutes = require('./Routes/userRoutes');
const transactionRoutes = require('./Routes/transactionRoutes');
const goalRoutes = require('./Routes/goalRoutes');
const weatherRoutes = require('./Routes/weatherRoutes');

// 4. Route Handlers
app.use('/user', userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/goals', goalRoutes);
app.use('/weather', weatherRoutes);

// 5. Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'src', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'build', 'index.html'));
  });
}

// 6. DB connection + server start
mongoose.connect(process.env.MONGODBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 3001}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

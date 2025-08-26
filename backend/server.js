// 1. Core setup and config
require('dotenv').config();                 // Load env vars early
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// 2. Import route modules
const userRoutes = require('./Routes/userRoutes');
const transactionRoutes = require('./Routes/transactionRoutes');
const goalRoutes = require('./Routes/goalRoutes');
const weatherRoutes = require('./Routes/weatherRoutes');

// 3. Middleware
app.use(cors(
    {origin: 'https://budget-buddy-front-end.onrender.com' // your React frontend dev URL
  }
));                            // Enable CORS first
app.use(express.json());                    // Then parse JSON body
app.use(cookieParser());                    // Then parse cookies

// 4. Route Handlers
app.use('/user', userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/goals', goalRoutes);
app.use('/weather', weatherRoutes);

// 5. Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

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

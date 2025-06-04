const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');



const userRoutes = require('./Routes/userRoutes');
const transactionRoutes = require('./Routes/transactionRoutes');
const goalRoutes = require('./Routes/goalRoutes');
const port = process.env.PORT || 3001;

app.use(cors());
//middleware to parse json
app.use(express.json());
app.use(cookieParser());

app.use('/user', userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/goals', goalRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
  });
  
mongoose.connect(process.env.MONGODBURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log('Connect to MongoDB');
    //Start the server after the database connection is established
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
})
.catch((err) => {
    console.log('Error connecting MongoDB:', err);
});

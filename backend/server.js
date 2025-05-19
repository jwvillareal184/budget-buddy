const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./Models/User');
const app = express();
require('dotenv').config()
const port = 3005;

app.use(cors());
//middleware to parse json
app.use(express.json());

//basic route
app.get('/', (req, res) => {
    res.send('world world');
});

//it will create new user
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

//it gets all the users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch  (error){
        res.status(500).json({message: error.message});
    }
});

//get a user based on the id
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            res.json(user);
        } else {
            res.status(404).json({message: 'User not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(user) {
            res.json(user);
        } else {
            res.status(400).json({message: error.message});
        }
    } catch(error) {
        res.status(400).json({message: error.message});
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User .findByIdAndDelete(req.params.id);
        if (user) {
            res.json({message: 'User deleted'});
        } else {
            res.status(404).json({message: 'User not found'});
        }
    } catch(error) {
        res.status(500).json({message: error.message});
    }
})


mongoose.connect(process.env.MONGODBURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log('Connect to MongoDB');
    //Start the server after the database connection is established
    app.listen(port, () => {
        console.log(`Server listening in the http://localhost: ${port}`);
    });
})
.catch((err) => {
    console.log('Error connecting MongoDB:', err);
});

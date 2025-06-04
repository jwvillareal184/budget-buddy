const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const requireAuth = require('../Middleware/auth'); 
const User = require('../Models/User.js');
const { request } = require('http');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || '2d3548a504a69e053a3027f4945b19294e832a66c3fc6c43e5aeb05ce5106e8cea5c5820b0b1d04716437794745bd4b5e604ea34e7207d6b6605fb92ad302b67';


router.post('/register', async(request, response) => {
    try{
        console.log(request.body)
        const {fname, lname, email, phoneNum, birthday, occupation, password} = request.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('there is existing email or user');
        }
        
        // the number of rounds that will be hashed the entered password
       const saltRounds = 10;
       const hashedPassword = await bcrypt.hash(password, saltRounds); //the password is hasing 10 rounds
       console.log(hashedPassword) 
       const user = new User(
            {
            fname, 
            lname,
            email,
            phoneNum,
            birthday,
            occupation,
            password: hashedPassword}
        );
 
        await user.save();
        response.status(201).json({
            message: 'User created',
            user: {
              id: user._id,
              email: user.email,
              fname: user.fname,
              lname: user.lname
            }
          });
          
    } catch (err) {
        console.error('Register route error:', err); // Add this for better debugging
        response.status(400).json({error: err.message});
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      // First check: does the user exist?
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      // Now it's safe to check the password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      // Create JWT token with user ID as payload
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Send token with response
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          fname: user.fname,
          lname: user.lname
        }
      });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // true in production with HTTPS
        maxAge: 3600000, // 1 hour
      });
      
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  

router.get('/users', requireAuth, async(request, response) => {
    try{
        const user = await User.find();
        response.json(user);
    } catch (err) {
        response.status(500).json({error: err.message});
    }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/users/:id', requireAuth, async(request, response) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(request.params.id, request.body, { new: true });
        response.json(updatedUser);
        
    } catch (err) {
        response.status(500).json({error: err.message});
    }
})

router.delete('/users/:id', requireAuth,  async (request, response) => {
    try {
        await User.findByIdAndDelete(request.params.id);

        response.json({message: 'User Deleted'});
    } catch(err) {
        response.status(500).json({error: err.message});
    }
})

module.exports = router;
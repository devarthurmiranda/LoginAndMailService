require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');

// Models
const User = require('../model/User');

// Listen to port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Default route
app.get('/', (req, res) => {
    res.send('Server is running successfully');
});

// Connect to database
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

// Config JSON response
app.use(express.json());

// Register
app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;

    // Validate
    if (!username || !password) {
        res.status(422).json({ msg: 'Please enter all fields' });
    }

    // Check if user exists
    const userExists = User.findOne({ username }).then((user) => {
        if (user) {
            return true;
        } else {
            return false;
        }
    });

    
    // Create Password
    const salt = await bcrypt.genSalt(12) // Salt is used to add random string to password when hashing
    const hash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
        username,
        password: hash
    });
    
    try{
        if (await userExists) {
            return res.status(400).json({ msg: 'User already exists' });
        } else {
            newUser.save().then((user) => {
                res.json({ msg: 'User created successfully' });
            })
        }
    } catch(err) {
        res.status(400).json({ msg: 'Something went wrong while creating User' });
    }
});

// Login
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate
    if (!username || !password) {
        res.status(422).json({ msg: 'Please enter all fields' });
    }

    const user = User.findOne({ username }).then((user) => {
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        // Validate password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            } else {
                res.json({ msg: 'Login successful' });
            }
        });
    });

});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');

// Models
const User = require('../model/User');

// Configs
app.engine('html', require('ejs').renderFile);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    })
);
app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization'
  }));

app.use(express.json());

// Static files
app.set('view engine', 'html');
app.set('views', [
    path.join(__dirname, '..', 'app', 'view', 'public'),
    path.join(__dirname, '..', 'app', 'view', 'private')
]);
app.use('/script', express.static(path.join(__dirname, '..', 'app', 'script')));
app.use('/style', express.static(path.join(__dirname, '..', 'app', 'style')));
app.use('/assets', express.static(path.join(__dirname, '..', 'app', 'view', 'assets')));

// Listen
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Connect to database
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

// Public Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Register
app.post('/user/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(422).json({ msg: 'Please enter all fields' });
    }

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
app.post('/user/login', async (req, res) => {
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
            } 
            req.session.user = user;
            res.redirect('/user/home');
        });
    });

});

// Logout
app.get('/user/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Check if user is logged in
const checkLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Private Routes
app.get('/user/home', (req, res) => {
    res.render('user/home');
});

app.get('/user/sendmail', checkLoggedIn, (req, res) => {
    res.render('user/sendmail');
});

app.get('/user/accounts', checkLoggedIn, (req, res) => {
    res.render('user/accounts');
});
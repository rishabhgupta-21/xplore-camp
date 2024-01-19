if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Models
const User = require('./models/user');

// Routers
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/xplore-camp')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(error => console.log(error));

mongoose.connection.on('error', error => console.log(error));

// Constants
const PORT = 3000;
const SESSION_CONFIG = {
    secret: 'thisshouldbeanactualsecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,    // 1 week (in milliseconds)
    },
}

// View settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session and Flash Middlewares
app.use(session(SESSION_CONFIG));
app.use(flash());

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());       // Store user in session
passport.deserializeUser(User.deserializeUser());   // Retrieve user from session

app.use((req, res, next) => {
    // Flash
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // User (Passport)
    res.locals.currentUser = req.user;

    next();
});

// Routing Middlewares
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:campground_id/reviews', reviewRoutes);


// Home Page
// GET /
app.get('/', (req, res) => {
    res.render('home');
});

// Any other unknown route
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    const { message = 'Something Went Wrong!', statusCode = 500 } = err;
    if (!err.message)
        err.message = 'Something Went Wrong!';
    if (!err.statusCode)
        err.statusCode = 500;
    res.status(statusCode).render('error', { err });
});

// Listen on port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
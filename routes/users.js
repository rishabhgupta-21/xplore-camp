const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

// Controllers
const users = require('../controllers/users');

// Middleware
const { storeReturnTo } = require('../middleware');


// @desc    Show form to register new user 
// @route   GET /register
// @access  public
router.get('/register', users.renderRegisterForm);

// @desc    Register new user
// @route   POST /register
// @access  public
router.post('/register', catchAsync(users.registerUser));

// @desc    Show form to login
// @route   GET /login
// @access  public
router.get('/login', users.renderLoginForm);

// @desc    Login a user
// @route   POST /login
// @access  public
router.post('/login',
    storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    catchAsync(users.loginUser)
);

// @desc Logout a user
// @route POST /logout
// @access public
router.post('/logout', users.logoutUser)

module.exports = router;
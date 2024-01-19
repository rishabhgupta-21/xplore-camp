// Models
const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    // Adding in another try catch block to handle errors in a different way, rather than the generic way. (We don't really need the catchAsync wrapper now)
    try {
        const { username, email, password } = req.body;

        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);   // NOTE: register() is a method added to the User Schema/Model by passport-local-mongoose
        // console.log(registeredUser);

        // Login the user after registering
        req.login(registeredUser, function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Xplore Camp!');
            res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = async (req, res) => {
    req.flash('success', 'Welcome back! Succesfully logged in!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        req.flash('success', 'Succesfully logged out!');
        res.redirect('/campgrounds');
    });
}
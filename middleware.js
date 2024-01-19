const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

// Models
const Campground = require('./models/campground');
const Review = require('./models/review');

// JOI Validation Schema
const { campgroundSchemaValidation, reviewSchemaValidation } = require('./utils/validationSchemas');

// Middleware
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        req.session.returnTo = (req.query._method === 'DELETE' ? `/campgrounds/${id}` : req.originalUrl);
        // needed for delete review button, if conditional is not present on campgrounds show template
        // NOTE: req.originalUrl is the url that the user is trying to access

        req.flash('error', 'You need to be logged in.');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// Campground Middleware
module.exports.validateCampground = (req, res, next) => {
    // Validate req.body wrt JOI Validation Schema for submitted Campground
    const { error } = campgroundSchemaValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

module.exports.isCampgroundAuthor = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
});

// Review Middleware
module.exports.validateReview = (req, res, next) => {
    // Validate req.body wrt JOI Validation Schema for submitted Review
    const { error } = reviewSchemaValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
    const { campground_id, review_id } = req.params;
    const review = await Review.findById(review_id);

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/campgrounds/${campground_id}`);
    }
    next();
});
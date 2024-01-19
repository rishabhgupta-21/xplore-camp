const express = require('express');
const router = express.Router({ mergeParams: true });   // NOTE: mergeParams: true is required to access req.params from parent router
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// Controllers
const reviews = require('../controllers/reviews');

// Middleware
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


// @desc    Create new review
// @route   POST /campgrounds/:campground_id/reviews
// @access  private
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// @desc    Delete one specific review
// @route   DELETE /campgrounds/:campground_id/reviews/:review_id
// @access  private
router.delete('/:review_id', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
// Models
const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.campground_id);
    const review = new Review(req.body.review);

    review.author = req.user._id;
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    req.flash('success', 'Review posted!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { campground_id, review_id } = req.params;

    await Review.findByIdAndDelete(review_id);
    await Campground.findByIdAndUpdate(campground_id, { $pull: { reviews: review_id } });

    req.flash('success', 'Review deleted!');
    res.redirect(`/campgrounds/${campground_id}`);
}
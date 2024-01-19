const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');

// Schema setup
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [
        {
            url: String,
            filename: String,
        }
    ],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
});

// Adding in virtual properties for 'images' to be displayed with transformations (from Cloudinary).
// Thumbnail
CampgroundSchema.path('images').schema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload/', '/upload/c_thumb,g_auto,h_200,w_200/');
});

// Carousel
CampgroundSchema.path('images').schema.virtual('carouselImages').get(function () {
    return this.url.replace('/upload/', '/upload/ar_4:3,c_crop/');
});

// Mongoose Post-Middleware for deleting associated Reviews
CampgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground && campground.reviews.length) {
        await Review.deleteMany({
            _id: {
                $in: campground.reviews
            }
        });
    }
});

// Export a Model
module.exports = mongoose.model('Campground', CampgroundSchema);
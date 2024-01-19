const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

// Models
const Campground = require('../models/campground');
const Review = require('../models/review');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/xplore-camp')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(error => console.log(error));

mongoose.connection.on('error', error => console.log(error));

// Helper Function for title & location
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Seed Function
const seedDB = async () => {
    // Delete all Campgrounds and Reviews
    await Campground.deleteMany({});
    await Review.deleteMany({});

    // Seed new campgrounds
    for (let i = 0; i < 50; i++) {
        const randomCityNumber = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            author: '659bf2f850035782abac0089',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[randomCityNumber].city}, ${cities[randomCityNumber].state}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dbgfxp7sj/image/upload/v1705574638/XploreCamp/pb8nzru09wvrhorc3mqw.jpg',
                    filename: 'XploreCamp/pb8nzru09wvrhorc3mqw',
                },
                {
                    url: 'https://res.cloudinary.com/dbgfxp7sj/image/upload/v1705574637/XploreCamp/qaljuanjltcfgk2x3xlu.jpg',
                    filename: 'XploreCamp/qaljuanjltcfgk2x3xlu',
                }
            ],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis, perspiciatis architecto. Odio sapiente nesciunt reiciendis accusamus delectus ad quo dolorum nisi, minima voluptate facilis magni voluptatibus cum voluptatum, possimus animi.',
            price: price,
        });

        await camp.save();
    }
}

seedDB()
    .then(() => mongoose.connection.close());
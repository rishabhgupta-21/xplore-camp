const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Setting up Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setting up an instance of CloudinaryStorage, which we will export.
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'XploreCamp',
        allowed_formats: ['jpeg', 'jpg', 'png'],
    },
});

module.exports = {
    cloudinary,
    storage
};
// Cloudinary
const { cloudinary } = require('../cloudinary');
// Models
const Campground = require('../models/campground');

module.exports.showAllCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);

    // Add images to campground from req.files (added in by multer)
    campground.images = req.files.map((file) => {
        return {
            url: file.path,
            filename: file.filename,
        }
    });

    campground.author = req.user._id;

    await campground.save();
    console.log(campground);

    req.flash('success', 'Campground succesfully created!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('author').populate({
        path: 'reviews',
        populate: 'author'
    });
    // console.log(campground.reviews);

    if (!campground) {
        req.flash('error', 'Campground does not exist.');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground) {
        req.flash('error', 'Campground does not exist.');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);

    const campground = await Campground.findByIdAndUpdate(id,
        { ...req.body.campground },
        { runValidators: true, new: true }
    );

    // Add images to campground from req.files (added in by multer)
    if (req.files.length > 0) {
        const newImages = req.files.map((file) => {
            return {
                url: file.path,
                filename: file.filename,
            }
        });
        campground.images.push(...newImages);
    }

    // Potentially Delete any existing images
    if (req.body.deleteImages) {
        // Delete from Cloudinary
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        // Delete from MongoDB
        await campground.updateOne(
            { $pull: { images: { filename: { $in: req.body.deleteImages } } } },
            { new: true }
        );
    }

    // console.log(campground);
    await campground.save();
    req.flash('success', 'Campground succesfully updated!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground succesfully deleted!');
    res.redirect('/campgrounds');
}
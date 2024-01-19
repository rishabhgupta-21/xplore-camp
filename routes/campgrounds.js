const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// Storing Images to Cloudinary
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage: storage });

// Controllers
const campgrounds = require('../controllers/campgrounds');

// Middleware
const { validateCampground, isLoggedIn, isCampgroundAuthor } = require('../middleware');


// @desc    Show all campgrounds
// @route   GET /campgrounds
// @access  public
router.get('/', catchAsync(campgrounds.showAllCampgrounds));

// @desc    Show form to create new campground
// @route   GET /campgrounds/new
// @access  private
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// @desc    Create new campground
// @route   POST /campgrounds
// @access  private
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

// @desc    Show one specific campground
// @route   GET /campgrounds/:id
// @access  public
router.get('/:id', catchAsync(campgrounds.showCampground));

// @desc    Show form to edit one specific campground
// @route   GET /campgrounds/:id/edit
// @access  private
router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, catchAsync(campgrounds.renderEditForm));

// @desc    Update (Edit) one specific campground
// @route   PUT /campgrounds/:id
// @access  private
router.put('/:id', isLoggedIn, isCampgroundAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground));

// @desc    Delete one specific campground
// @route   DELETE /campgrounds/:id
// @access  private
router.delete('/:id', isLoggedIn, isCampgroundAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
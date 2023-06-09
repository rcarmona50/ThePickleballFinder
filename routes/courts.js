const express = require('express');
const router = express.Router();
const courts = require('../controllers/courts')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateCourt } = require('../middleware')
const Court = require('../models/court')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(courts.index))
    .post(isLoggedIn, upload.array('image'), validateCourt, catchAsync(courts.createCourt))
    
router.get("/new", isLoggedIn, courts.renderNewForm)

router.route('/:id')
    .get(catchAsync(courts.showCourt))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCourt, catchAsync(courts.updateCourt))
    .delete(isLoggedIn, isAuthor, catchAsync(courts.deleteCourt)) 


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(courts.renderEditForm))

module.exports = router;
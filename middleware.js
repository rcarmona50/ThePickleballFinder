const { courtSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError')
const Court = require('./models/court')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
// Validate Schema
module.exports.validateCourt = (req, res, next) =>{
    const { error } = courtSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const court = await Court.findById(id)
    if (!court.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission')
        return res.redirect(`/courts/${id}`)
    }
    next();
}


module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission')
        return res.redirect(`/courts/${ id }`)
    }
    next();
}

// middleware
module.exports.validateReview = (req, res, next) =>{
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
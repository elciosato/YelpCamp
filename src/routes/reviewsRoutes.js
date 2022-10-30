const express = require("express")

const router = express.Router({mergeParams: true});
const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');

const {reviewSchema} = require('../joiSchemas');
const Campground = require("../models/campground")
const Review = require("../models/review")

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post("/", validateReview, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const { body, rating } = req.body.review
    const campground = await Campground.findById(id);
    const review = new Review({ body, rating })
    campground.reviews.push(review);
    await review.save()
    await campground.save()
    req.flash("success", "Review has been saved successfully")
    res.redirect(`/campgrounds/${id}`)
}));

router.delete("//:reviewId",CatchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    const campground = await Campground.findById(id);
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{ $pull: { reviews: reviewId }})
    // campground.reviews.splice(campground.reviews.indexOf(review),1);
    // await campground.save()
    req.flash("success", "Review has been deleted successfully")
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;
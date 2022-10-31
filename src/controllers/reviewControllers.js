const Campground = require("../models/campground")
const Review = require("../models/review")

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const { body, rating } = req.body.review
    const campground = await Campground.findById(id);
    const review = new Review({ body, rating })
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save()
    await campground.save()
    req.flash("success", "Review has been saved successfully")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    const campground = await Campground.findById(id);
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{ $pull: { reviews: reviewId }})
    // campground.reviews.splice(campground.reviews.indexOf(review),1);
    // await campground.save()
    req.flash("success", "Review has been deleted successfully")
    res.redirect(`/campgrounds/${id}`)
}

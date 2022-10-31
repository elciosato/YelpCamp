const express = require("express")
const router = express.Router({mergeParams: true});

const CatchAsync = require('../utils/CatchAsync');
const Campground = require("../models/campground")
const Review = require("../models/review")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")
const reviewControllers = require("../controllers/reviewControllers")

router.post("/", isLoggedIn, validateReview, CatchAsync(reviewControllers.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, CatchAsync(reviewControllers.deleteReview))

module.exports = router;
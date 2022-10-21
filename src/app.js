const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const Review = require('./models/review');
const CatchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('./joiSchemas');

const app = express();
app.engine('ejs', ejsMate);

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

mongoose.connect('mongodb://yelpcampUsr:y3lpcampUsr123@localhost/yelpcampDB');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

app.get("/", (req, res) => {
    res.render("home")
});

app.get("/campgrounds", CatchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

app.post("/campgrounds", validateCampground, CatchAsync(async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id/edit", CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
}));

app.put("/campgrounds/:id", validateCampground, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get("/campgrounds/:id", CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground });
}));

app.delete("/campgrounds/:id", CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

app.post("/campgrounds/:id/reviews", validateReview, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const { body, rating } = req.body.review
    const campground = await Campground.findById(id);
    const review = new Review({ body, rating })
    campground.reviews.push(review);
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${id}`)
}));

app.delete("/campgrounds/:id/reviews/:reviewId",CatchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    const campground = await Campground.findById(id);
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{ $pull: {reviews: reviewId}})
    // campground.reviews.splice(campground.reviews.indexOf(review),1);
    // await campground.save()
    res.redirect(`/campgrounds/${id}`)
}))

app.all("*", (req, res, next) => {
    return next(new ExpressError("Page not found!", 404));
})

app.use((err, req, res, next) => {
    if (!err.statusCode) {
        err.statusCode = 500
    }
    if (!err.message){
        err.message = "Something went wrong!"
    }
    res.status(err.statusCode).render("error", {err});
})

module.exports = app;
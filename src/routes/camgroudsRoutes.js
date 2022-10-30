const express = require("express")

const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');

const {campgroundSchema} = require('../joiSchemas');
const Campground = require('../models/campground');

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get("/", CatchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.post("/", validateCampground, CatchAsync(async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash("success", "Campground has been created successfully")
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.get("/new", (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id/edit", CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground });
}));

router.put("/:id", validateCampground, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "Campground has been updated successfully")
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get("/:id", CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground) {
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground });
}));

router.delete("/:id", CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

module.exports = router;
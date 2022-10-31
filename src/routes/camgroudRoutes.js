const express = require("express")

const router = express.Router();

const CatchAsync = require('../utils/CatchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get("/", CatchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.post("/", isLoggedIn, validateCampground, CatchAsync(async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Campground has been created successfully")
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id/edit", isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground });
}));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "Campground has been updated successfully")
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get("/:id", CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"    
            }
        })
        .populate("author");
    if (!campground) {
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground });
}));

router.delete("/:id", isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

module.exports = router;
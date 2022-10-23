const express = require("express")
const router = express.Router();
const ExpressError = require('../utils/ExpressError');

const campgroudsRoutes = require("./camgroudsRoutes")
const reviewsRoutes = require("./reviewsRoutes")

router.get("/", (req, res) => {
    res.render("home")
});

router.use("/campgrounds", campgroudsRoutes);
router.use("/campgrounds/:id/reviews", reviewsRoutes);

router.all("*", (req, res, next) => {
    return next(new ExpressError("Page not found!", 404));
})

router.use((err, req, res, next) => {
    if (!err.statusCode) {
        err.statusCode = 500
    }
    if (!err.message){
        err.message = "Something went wrong!"
    }
    res.status(err.statusCode).render("error", {err});
})

module.exports = router;
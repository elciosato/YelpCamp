const express = require("express")
const router = express.Router();
const ExpressError = require('../utils/ExpressError');

const campgroudRoutes = require("./camgroudRoutes")
const reviewRoutes = require("./reviewRoutes")
const userRoutes = require("./userRoutes")

// Middleware
router.use((req, res, next) => {
  if (!["/login", "/"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  res.locals.currentUser = req.user;
  // save flash messages
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next();
})

router.get("/", (req, res) => {
    res.render("home")
});

router.use("/campgrounds", campgroudRoutes);
router.use("/campgrounds/:id/reviews", reviewRoutes);
router.use("/", userRoutes);

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
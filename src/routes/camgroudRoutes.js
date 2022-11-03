const express = require("express");

const router = express.Router();

const CatchAsync = require("../utils/CatchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgroundControllers = require("../controllers/campgroundControllers");
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(CatchAsync(campgroundControllers.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    CatchAsync(campgroundControllers.createCampground)
  );

// The new route needs to be before /:id route
router.get("/new", isLoggedIn, campgroundControllers.renderNewForm);

router
  .route("/:id")
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    CatchAsync(campgroundControllers.updateCampground)
  )
  .get(CatchAsync(campgroundControllers.showCampground))
  .delete(
    isLoggedIn,
    isAuthor,
    CatchAsync(campgroundControllers.deleteCampground)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  CatchAsync(campgroundControllers.renderEditForm)
);

module.exports = router;

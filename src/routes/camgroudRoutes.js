const express = require("express")

const router = express.Router();

const CatchAsync = require('../utils/CatchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgroundControllers = require("../controllers/campgroundControllers")

router.get("/", CatchAsync(campgroundControllers.index));

router.post("/", isLoggedIn, validateCampground, CatchAsync(campgroundControllers.createCampground));

router.get("/new", isLoggedIn, campgroundControllers.renderNewForm);

router.get("/:id/edit", isLoggedIn, isAuthor, CatchAsync(campgroundControllers.renderEditForm));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, CatchAsync(campgroundControllers.updateCampground));

router.get("/:id", CatchAsync(campgroundControllers.showCampground));

router.delete("/:id", isLoggedIn, isAuthor, CatchAsync(campgroundControllers.deleteCampground));

module.exports = router;
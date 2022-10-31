const express = require("express");
const passport = require("passport");
const router = express.Router();

const User = require("../models/user");
const CatchAsync = require("../utils/CatchAsync");
const userControllers = require("../controllers/userControllers")

router.get("/register", userControllers.renderRegisterForm)

router.post("/register", CatchAsync( userControllers.createUser ));

router.get("/login", userControllers.renderLoginForm)

router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), userControllers.loginUser)

router.get("/logout", userControllers.logoutUser)

module.exports = router;


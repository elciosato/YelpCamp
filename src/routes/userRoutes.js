const express = require("express");
const passport = require("passport");
const router = express.Router();

const User = require("../models/user");
const CatchAsync = require("../utils/CatchAsync");
const userControllers = require("../controllers/userControllers")

router.route("/register")
  .get(userControllers.renderRegisterForm)
  .post(CatchAsync( userControllers.createUser ));

router.route("/login")  
  .get(userControllers.renderLoginForm)
  .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), userControllers.loginUser)

router.get("/logout", userControllers.logoutUser)

module.exports = router;


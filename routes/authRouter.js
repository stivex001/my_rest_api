const express = require("express");
const { body } = require("express-validator/check");
const User = require("../models/userModel");
const authController = require("../controllers/authController");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter your email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least"),
    body("name").trim().not().isEmpty(),
  ],
  authController.signUp
);

router.post('/login', authController.login)

module.exports = router;

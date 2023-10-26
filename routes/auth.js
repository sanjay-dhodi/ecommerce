const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/auth");

router.post("/signup", check("email").isEmail().withMessage("please enter valid email"), authController.signupUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logout);
router.get("/forgotpassword", authController.forgotpassword);
router.post("/forgotpassword", authController.postforgotpassword);
router.get("/reset/:token", authController.renderResetPage);
router.post("/reset/:token", authController.resetpassword);

module.exports = router;

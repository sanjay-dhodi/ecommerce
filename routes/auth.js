const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logout);

module.exports = router;

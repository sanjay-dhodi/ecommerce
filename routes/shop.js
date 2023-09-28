const express = require("express");
const router = express.Router();

require("../utility");

const shoppageController = require("../controllers/shop");

router.get("/", shoppageController.renderShopPage);
router.get("/login", shoppageController.renderLoginPage);
router.get("/signup", shoppageController.renderSignupPage);

// const authController = require("../controllers/auth");

// router.post("/signup", authController.signupUser);

module.exports = router;

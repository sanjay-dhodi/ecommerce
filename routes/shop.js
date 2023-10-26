const express = require("express");
const router = express.Router();

require("../utility");

const verifyUser = require("../middlewere/jwtVerify");

const shoppageController = require("../controllers/shop");

router.get("/", verifyUser, shoppageController.renderShopPage);
router.get("/login", shoppageController.renderLoginPage);
router.get("/signup", shoppageController.renderSignupPage);

module.exports = router;
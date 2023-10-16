const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logout);
router.get("/forgotpassword", authController.forgotpassword);
router.post("/forgotpassword", authController.postforgotpassword);
router.get("/reset", (req, resp) => {
  resp.render("resetpassword", { loginUser: false });
});

module.exports = router;

// register or sign up user
const usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupUser = async (req, resp, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (confirmPassword === password) {
    bcrypt.hash(password, 12, function (err, hash) {
      try {
        const user = new usermodel({
          email: email,
          password: hash,
          cartItem: ["ff", "HH", "gg"],
        });

        user.save();

        resp.redirect("/login");
      } catch (error) {
        console.log(error);
      }
    });
  } else {
    console.log("confirm password does not match");
  }
};

const loginUser = (req, resp, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    usermodel.findOne({ email: email }).then((foundUser) => {
      if (!foundUser) {
        console.log("user  not found !");
        return;
      } else {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result == true) {
            const { _id } = foundUser._doc;
            const token = jwt.sign({ id: _id.toString() }, process.env.JWT_SECRETE);

            //  encrypting JWT token  for store in cookie

            resp.cookie("access_token", token, { httpOnly: true, secure: true });
            resp.redirect("/");
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const logout = (req, resp, next) => {
  resp.clearCookie("access_token");
  req.session.destroy();
  resp.redirect("/login");
};

module.exports = { signupUser, loginUser, logout };

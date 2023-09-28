// register or sign up user
const usermodel = require("../models/user");
const bcrypt = require("bcrypt");

const signupUser = async (req, resp, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password === confirmPassword) {
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
    console.log("conform password does not match");
  }
};

const loginUser = (req, resp, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    usermodel.findOne({ email: email }).then((foundUser) => {
      bcrypt.compare(password, foundUser.password, function (err, result) {
        if (result == true) {
          const { password, ...otherDetails } = foundUser._doc;

          req.session.loginUser = otherDetails;
          resp.redirect("/");
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const logout = (req, resp, next) => {
  req.session.destroy();
  resp.redirect("/login");
};

module.exports = { signupUser, loginUser, logout };

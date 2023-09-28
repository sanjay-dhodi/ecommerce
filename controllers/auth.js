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
          resp.send("succefully login");
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { signupUser, loginUser };

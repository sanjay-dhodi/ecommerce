// register or sign up user
const usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const ejs = require("ejs");

const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GEMAIL,
    pass: process.env.PASSWORD,
  },
});

const signupUser = async (req, resp, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
  }

  const alreadyExistuser = await usermodel.findOne({ email: email });
  if (alreadyExistuser) {
    console.log("this user is already exist try with diffrent email");
    resp.redirect("/signup");
  }

  if (!alreadyExistuser) {
    if (confirmPassword === password) {
      bcrypt.hash(password, 12, function (err, hash) {
        try {
          const user = new usermodel({
            email: email,
            password: hash,
            cartItem: ["ff", "HH", "gg"],
          });
          user.save();
          console.log("user successfully created");
          resp.redirect("/login");
        } catch (error) {
          console.log(error);
        }
      });
    } else {
      console.log("confirm password does not match");
    }
  }
};

const loginUser = (req, resp, next) => {
  const email = req.body.email;
  const password = req.body.password;

  ejs.clearCache();

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

const forgotpassword = (req, resp, next) => {
  if (!req.user) {
    resp.render("forgotpassword", { loginUser: false });
  } else {
    resp.render("forgotpassword", { loginUser: true });
  }
};

const postforgotpassword = (req, resp, next) => {
  const email = req.body.email;

  try {
    usermodel.findOne({ email: email }).then((user) => {
      if (!user) {
        console.log("you are not registered user please register !");
        resp.redirect("/login");
      } else {
        crypto.randomBytes(32, (err, buffer) => {
          if (err) {
            console.log("crypto token error");
            resp.redirect("/forgotpassword");
          }

          if (!err) {
            const bufftoken = buffer.toString("hex");
            user.resetToken = bufftoken;
            user.resetTokenExpiry = Date.now() + 3600000;

            const mailOptions = {
              from: process.env.FROM_EMAIL, // Sender's email address
              to: process.env.TO_EMAIL, // Recipient's email address
              subject: "Hello from Node.js",
              text: "password reset link to reset password visit on below link",
              html: "<a href='http://localhost:1888/reset/'" + bufftoken + ">click on this link</a> ",
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error("Error sending email:", error);
                resp.status(500).send("Error sending email");
              } else {
                // save token in database
                user.save();
                console.log("Email sent:", info);
                resp.send("Email sent successfully");
              }
            });
          }
        });
        // console.log("email sent to your registered email please check ");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const renderResetPage = async (req, resp, next) => {
  const resetToken = req.params.token;

  if (!resetToken) {
    console.log("reset Token not found");
  }

  if (resetToken) {
    try {
      await usermodel
        .findOne({ resetToken: resetToken })
        .then((user) => {
          if (!user) {
            console.log("user not found with this token");
            resp.redirect("/login");
          } else {
            if (!req.user) {
              resp.render("resetpassword", { loginUser: false });
            } else {
              resp.render("resetpassword", { loginUser: true });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }
};

const resetpassword = (req, resp, next) => {
  const resetToken = req.params.token;

  if (!resetToken) {
    resp.redirect("/login");
  } else if (resetToken) {
    usermodel
      .findOne({ resetToken: resetToken })
      .then((user) => {
        if (!user) {
          resp.json({ msg: "usernot found" });
        } else {
          resp.json({ foundUser: user });
          user.resetTokenExpiry = undefined;
          user.resetToken = undefined;
          user.save();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("reset token is not set invalid request");
    resp.redirect("/login");
  }
};

module.exports = { signupUser, loginUser, logout, forgotpassword, postforgotpassword, renderResetPage, resetpassword };

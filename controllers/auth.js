// register or sign up user
const usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

const forgotpassword = (req, resp, next) => {
  console.log(process.env.JWT_SECRETE);

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
            user.save();

            const mailOptions = {
              from: "infosanju07@gmail.com", // Sender's email address
              to: "infosanju07@gmail.com", // Recipient's email address
              subject: "Hello from Node.js",
              html: "<h1>" + bufftoken + "</h1> ",
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error("Error sending email:", error);
                resp.status(500).send("Error sending email");
              } else {
                console.log("Email sent:", info.response);
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

module.exports = { signupUser, loginUser, logout, forgotpassword, postforgotpassword };

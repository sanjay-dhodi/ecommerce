const jwt = require("jsonwebtoken");

const verifyUser = (req, resp, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("no token found");
  }

  jwt.verify(token, process.env.JWT_SECRETE, (err, user) => {
    if (err) {
      console.log("invalid token");
      next();
    }
    if (user) {
      req.user = user.id;
      next();
    }
  });
};

module.exports = verifyUser;

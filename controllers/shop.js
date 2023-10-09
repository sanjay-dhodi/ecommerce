const renderShopPage = (req, resp, next) => {
  if (!req.user) {
    resp.render("shop", { loginUser: false });
  } else {
    resp.render("shop", { loginUser: true });
  }
};

const renderLoginPage = (req, resp, next) => {
  if (!req.user) {
    resp.render("login", { loginUser: false });
  } else {
    resp.render("login", { loginUser: true });
  }
};

const renderSignupPage = (req, resp, next) => {
  if (!req.user) {
    resp.render("register", { loginUser: false });
  } else {
    resp.render("register", { loginUser: true });
  }
};

module.exports = { renderShopPage, renderLoginPage, renderSignupPage };

const renderShopPage = (req, resp, next) => {
  console.log(req.session.loginUser);

  resp.render("shop");
};

const renderLoginPage = (req, resp, next) => {
  resp.render("login");
};

const renderSignupPage = (req, resp, next) => {
  resp.render("register");
};

module.exports = { renderShopPage, renderLoginPage, renderSignupPage };

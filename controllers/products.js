const ProductsModel = require("../models/product.js");

// ####### render controllers #################

const renderAddproducts = (req, resp, next) => {
  if (!req.user) {
    resp.redirect("/login");
  } else {
    resp.render("admin/add_product", { loginUser: true });
  }
};

const renderProducts = (req, resp, next) => {
  if (!req.user) {
    resp.render("products", { loginUser: false });
  } else {
    resp.render("products", { loginUser: true });
  }
};

// ########  post controllers #############

const addProduct = (req, resp, next) => {
  resp.send("no data saved yet");
};

module.exports = { renderAddproducts, renderProducts, addProduct };

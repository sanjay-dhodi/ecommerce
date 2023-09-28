const ProductsModel = require("../models/product.js");

// ####### render controllers #################

const renderAddproducts = (req, resp, next) => {
  resp.render("admin/add_product");
};

const renderProducts = (req, resp, next) => {
  resp.render("products");
};

// ########  post controllers #############

const addProduct = (req, resp, next) => {
  const product = new ProductsModel(req.body.product_name,"sanju");
  product.save();

  console.log(ProductsModel.fetchAll());
  resp.send("");
};

module.exports = { renderAddproducts, renderProducts, addProduct };

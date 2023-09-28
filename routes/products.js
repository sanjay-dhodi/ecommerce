const express = require("express");
const router = express.Router();

const productsControllers = require("../controllers/products");
const shopController = require("../controllers/shop");

router.get("/addproduct", productsControllers.renderAddproducts);
router.post("/addproduct", productsControllers.addProduct);

router.get("/", shopController.renderShopPage);

module.exports = router;

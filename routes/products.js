const express = require("express");
const router = express.Router();
const verifyUser = require("../middlewere/jwtVerify");

const productsControllers = require("../controllers/products");
const shopController = require("../controllers/shop");

router.get("/addproduct", verifyUser, productsControllers.renderAddproducts);
router.post("/addproduct", verifyUser, productsControllers.addProduct);

router.get("/", shopController.renderShopPage);

module.exports = router;

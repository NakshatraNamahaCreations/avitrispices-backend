const express = require("express");
const router = express.Router();
const ProductController = require("../Controllers/productController");

router.post("/products", ProductController.createProduct);
router.get("/products", ProductController.getProducts);
router.get("/products/:productId", ProductController.getProductById);
router.put('/products/:productId', ProductController.updateProduct);
router.get("/sold-products", ProductController.getSoldProducts);
router.get("/products/category/:categoryName", ProductController.getProductsByCategory);
router.delete("/products/:productId", ProductController.deleteProduct); 
module.exports = router;

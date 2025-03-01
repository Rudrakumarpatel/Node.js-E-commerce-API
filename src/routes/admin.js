const express = require("express");
const {
    adminAuth,
    addCategory, updateCategory, deleteCategory, listCategories,
    addProduct, updateProduct, deleteProduct, listProducts,
    getOrders, updateOrderStatus, topSellingProducts
} = require("../controllers/adminController");

const {adminAuth1} = require("../middleware/auth");

const router = express.Router();
router.post("/auth", adminAuth);

router.post("/category",adminAuth1, addCategory);
router.put("/category/:id", adminAuth1, updateCategory);
router.delete("/category/:id", adminAuth1, deleteCategory);
router.get("/category", adminAuth1, listCategories);

router.post("/product", adminAuth1, addProduct);
router.put("/product/:id", adminAuth1, updateProduct);
router.delete("/product/:id", adminAuth1, deleteProduct);
router.get("/product", adminAuth1, listProducts);

router.get("/orders", adminAuth1, getOrders);
router.put("/orders/:id", adminAuth1, updateOrderStatus);
router.get("/sales/top-products", adminAuth1, topSellingProducts);

module.exports = router;

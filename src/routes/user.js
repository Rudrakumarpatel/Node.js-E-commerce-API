const express = require("express");
const {
    registerUser, userLogin, viewProducts, viewProduct, placeOrder, viewOrders
} = require("../controllers/userController");
const { userAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", userLogin);
router.get("/products", viewProducts);
router.get("/products/:id", viewProduct);
router.post("/order", userAuth, placeOrder);
router.get("/orders", userAuth, viewOrders);

module.exports = router;

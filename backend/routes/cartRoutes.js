const express = require("express");

const router = express.Router();

const {
    addToCart,
    getMyCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");


// Add product to cart
router.post("/", protect, addToCart);


// Get my cart
router.get("/", protect, getMyCart);


// Update quantity
router.put(
    "/:productId",
    protect,
    updateCartQuantity
);


// Clear entire cart
router.delete(
    "/clear",
    protect,
    clearCart
);


// Remove one product
router.delete(
    "/:productId",
    protect,
    removeFromCart
);


module.exports = router;
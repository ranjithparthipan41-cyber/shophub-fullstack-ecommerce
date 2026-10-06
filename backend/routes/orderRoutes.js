const express = require("express");

const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getSingleOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// Place order
router.post("/", protect, placeOrder);


// Get my orders
router.get("/my-orders", protect, getMyOrders);


// Admin - Get all orders
router.get(
    "/admin/all",
    protect,
    admin,
    getAllOrders
);


// Cancel order
router.put(
    "/:id/cancel",
    protect,
    cancelOrder
);

router.put(
    "/admin/:id/status",
    protect,
    admin,
    updateOrderStatus
);


// Get single order
router.get("/:id", protect, getSingleOrder);


module.exports = router;
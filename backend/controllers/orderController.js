const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");


// PLACE ORDER
const placeOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        // Check shipping address
        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode
        ) {
            return res.status(400).json({
                message: "Please provide complete shipping address"
            });
        }

        // Find user's cart
        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        // Check cart
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        // Prepare order items
        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            const product = item.product;

            // Check product exists
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            // Check stock
            if (item.quantity > product.stock) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }

            // Calculate item total
            const itemTotal = product.price * item.quantity;

            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress
        });

        // Reduce product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// GET MY ORDERS
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// GET SINGLE ORDER
const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// CANCEL ORDER
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Check order status
        if (order.status !== "Pending") {
            return res.status(400).json({
                message: "Only pending orders can be cancelled"
            });
        }

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        // Update order status
        order.status = "Cancelled";

        await order.save();

        res.status(200).json({
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ADMIN - GET ALL ORDERS
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ADMIN - UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        // Check status
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        // Find order
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const oldStatus = order.status;

        if (oldStatus !== "Cancelled" && status === "Cancelled") {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: item.quantity } }
                );
            }
        }

        if (oldStatus === "Cancelled" && status !== "Cancelled") {
            for (const item of order.items) {
                const product = await Product.findById(item.product);

                if (!product || product.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Not enough stock to reactivate ${item.name}`
                    });
                }
            }

            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: -item.quantity } }
                );
            }
        }

        // Update status
        order.status = status;

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate("user", "name email")
            .populate("items.product");

        res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    placeOrder,
    getMyOrders,
    getSingleOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
};
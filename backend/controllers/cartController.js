const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ADD TO CART
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Check productId and quantity
        if (!productId || !quantity) {
            return res.status(400).json({
                message: "Please provide productId and quantity"
            });
        }

        // Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check stock
        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Not enough stock"
            });
        }

        // Find user's cart
        let cart = await Cart.findOne({
            user: req.user.id
        });

        // If cart doesn't exist, create it
        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [
                    {
                        product: productId,
                        quantity
                    }
                ]
            });

            return res.status(201).json({
                message: "Product added to cart",
                cart
            });
        }

        // Check if product already exists in cart
        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + Number(quantity);

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: "Not enough stock"
                });
            }

            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();

        res.status(200).json({
            message: "Product added to cart",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// GET MY CART
const getMyCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        if (!cart) {
            return res.status(200).json({
                cart: {
                    user: req.user.id,
                    items: [],
                    totalAmount: 0
                }
            });
        }

        const totalAmount = cart.items.reduce(
            (total, item) => total + (item.product?.price || 0) * item.quantity,
            0
        );

        res.status(200).json({
            cart: { ...cart.toObject(), totalAmount }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// UPDATE CART QUANTITY
const updateCartQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        // Check quantity
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        // Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check stock
        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Not enough stock"
            });
        }

        // Find user's cart
        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        // Find product in cart
        const item = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        // Update quantity
        item.quantity = quantity;

        await cart.save();

        // Get updated cart with product details
        const updatedCart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        const totalAmount = updatedCart.items.reduce(
            (total, item) => total + (item.product?.price || 0) * item.quantity,
            0
        );

        res.status(200).json({
            message: "Cart quantity updated successfully",
            cart: { ...updatedCart.toObject(), totalAmount }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// REMOVE PRODUCT FROM CART
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find user's cart
        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        // Check product exists in cart
        const itemExists = cart.items.some(
            (item) => item.product.toString() === productId
        );

        if (!itemExists) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        // Remove product
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();

        // Get updated cart
        const updatedCart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        const totalAmount = updatedCart.items.reduce(
            (total, item) => total + (item.product?.price || 0) * item.quantity,
            0
        );

        res.status(200).json({
            message: "Product removed from cart",
            cart: { ...updatedCart.toObject(), totalAmount }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// CLEAR CART
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    addToCart,
    getMyCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
};
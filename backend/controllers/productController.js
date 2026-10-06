const Product = require("../models/Product");


// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stock,
            image
        } = req.body;

        // Check required fields
        if (
            !name ||
            !description ||
            !price ||
            !category ||
            stock === undefined
        ) {
            return res.status(400).json({
                message: "Please provide all product details"
            });
        }

        // Image
        const productImage = image?.trim() || "";

        // Create product
        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            image: productImage
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice
        } = req.query;

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
        const skip = (page - 1) * limit;

        let filter = {};

        // Search
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Category
        if (category) {
            filter.category = category;
        }

        // Price filter
        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            count: totalProducts,
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit)
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stock,
            image
        } = req.body;

        const product = await Product.findById(
            req.params.id
        );

        // Check product
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Update fields
        if (name !== undefined) {
            product.name = name;
        }

        if (description !== undefined) {
            product.description = description;
        }

        if (price !== undefined) {
            product.price = price;
        }

        if (category !== undefined) {
            product.category = category;
        }

        if (stock !== undefined) {
            product.stock = stock;
        }

        if (image !== undefined) {
            product.image = image;
        }

        if (req.file) {
            product.image = `/uploads/${req.file.filename}`;
        }

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// EXPORT ALL CONTROLLERS
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
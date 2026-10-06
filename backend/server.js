const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
    "/uploads",
    express.static("uploads")
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("ShopHub API is running...");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
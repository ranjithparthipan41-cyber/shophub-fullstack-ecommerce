require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "iPhone 17",
    description: "Latest Apple smartphone with a premium design and powerful performance.",
    price: 74999,
    category: "Electronics",
    stock: 15,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "MacBook Air",
    description: "Slim, lightweight laptop for work, study and everyday creativity.",
    price: 99999,
    category: "Electronics",
    stock: 8,
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Wireless Headphones",
    description: "Comfortable over-ear headphones with immersive everyday sound.",
    price: 4999,
    category: "Electronics",
    stock: 24,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Smart Watch Pro",
    description: "Modern smartwatch with notifications, fitness tracking and a bright display.",
    price: 8999,
    category: "Electronics",
    stock: 17,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Classic Hoodie",
    description: "Soft everyday hoodie with a clean minimal look.",
    price: 1999,
    category: "Clothing",
    stock: 30,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Premium Sneakers",
    description: "Versatile sneakers designed for daily comfort and casual style.",
    price: 3499,
    category: "Shoes",
    stock: 21,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with cushioned support.",
    price: 4299,
    category: "Shoes",
    stock: 18,
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "The Psychology of Money",
    description: "A practical book about behavior, wealth and making better financial decisions.",
    price: 499,
    category: "Books",
    stock: 40,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Modern Desk Lamp",
    description: "Minimal LED desk lamp for a focused workspace.",
    price: 1499,
    category: "Home",
    stock: 16,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Ceramic Coffee Set",
    description: "Elegant ceramic cups for coffee, tea and everyday hosting.",
    price: 1299,
    category: "Home",
    stock: 12,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Skincare Essentials",
    description: "A simple daily skincare set for a clean and fresh routine.",
    price: 1799,
    category: "Beauty",
    stock: 14,
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Everyday Backpack",
    description: "Roomy everyday backpack for work, college and travel.",
    price: 2299,
    category: "Clothing",
    stock: 20,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Bluetooth Speaker",
    description: "Compact wireless speaker with rich sound for home and travel.",
    price: 2999,
    category: "Electronics",
    stock: 22,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket that works with casual everyday outfits.",
    price: 2799,
    category: "Clothing",
    stock: 18,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Crossbody Bag",
    description: "Minimal crossbody bag with practical everyday storage.",
    price: 1899,
    category: "Clothing",
    stock: 25,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Premium Notebook Set",
    description: "Clean lined notebooks for planning, study and daily notes.",
    price: 699,
    category: "Books",
    stock: 35,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Indoor Plant Pot",
    description: "Modern ceramic planter to add a simple touch of green indoors.",
    price: 999,
    category: "Home",
    stock: 19,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Daily Face Serum",
    description: "Lightweight skincare serum for a simple daily routine.",
    price: 1499,
    category: "Beauty",
    stock: 27,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85"
  }
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    for (const product of products) {
      await Product.findOneAndUpdate(
        { name: product.name },
        product,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`Seed complete: ${products.length} products are ready.`);
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  }
}

seed();

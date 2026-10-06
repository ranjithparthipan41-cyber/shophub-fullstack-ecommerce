# ShopHub – Full Stack E-Commerce Application

ShopHub is a full-stack e-commerce web application built using the MERN stack.

## 🚀 Features

### User Features
- User registration and login
- JWT authentication
- Browse products
- Product details
- Search and filter products
- Add products to cart
- Update cart quantity
- Remove cart items
- Checkout
- Place orders
- View order history

### Admin Features
- Admin authentication
- Admin dashboard
- Product management
- Add products
- Edit products
- Delete products
- View customer orders
- Update order status

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication

### Database
- MongoDB
- Mongoose

## 📁 Project Structure

```text
ShopHub/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Authentication

ShopHub uses JWT-based authentication.

Users and admins have different permissions using role-based authorization.

## 🛒 Application Flow

```text
Register
   ↓
Login
   ↓
Browse Products
   ↓
Product Details
   ↓
Add to Cart
   ↓
Checkout
   ↓
Place Order
   ↓
My Orders
```

Admin flow:

```text
Admin Login
   ↓
Dashboard
   ↓
Manage Products
   ↓
Manage Orders
   ↓
Update Order Status
```

## 📌 Important

The `.env` file is not included in the repository for security reasons.

Never upload:

```text
.env
node_modules/
```

## 🎯 Project Goal

This project was built to demonstrate full-stack web development skills including:

- Frontend development
- REST API development
- Database integration
- Authentication
- Authorization
- CRUD operations
- E-commerce workflows
- Admin management

## 👨‍💻 Author

Ranjith

Full Stack Developer | MERN Stack
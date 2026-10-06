import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import AdminOrders from "./pages/AdminOrders";
import AdminRoute from "./components/AdminRoute";
import AdminProducts from "./pages/AdminProducts";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />


        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />
            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />
            <Route
              path="/admin/products/add"
              element={<AddProduct />}
            />
            <Route
              path="/admin/products/edit/:id"
              element={<EditProduct />}
            />
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

          </Route>

          <Route
            path="/cart"
            element={<Cart />}
          />
          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/my-orders"
            element={<MyOrders />}
          />
          <Route
            path="/orders/:id"
            element={<OrderDetails />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
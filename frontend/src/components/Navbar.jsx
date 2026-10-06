import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">
                    ShopHub
                </Link>

                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>

                {isAuthenticated && user?.role === "admin" && (
                    <>
                        <Link to="/admin">Dashboard</Link>
                        <Link to="/admin/orders">Orders</Link>
                    </>
                )}
            </div>

            <div className="navbar-right">
                {!isAuthenticated && (
                    <Link to="/login">Login</Link>
                )}

                {isAuthenticated && user?.role === "user" && (
                    <>
                        <Link to="/cart">Cart</Link>
                        <Link to="/my-orders">My Orders</Link>
                    </>
                )}

                {isAuthenticated && (
                    <>
                        <span className="navbar-user">
                            Hi, {user?.name || "User"}
                        </span>

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
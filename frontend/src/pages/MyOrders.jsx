import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/orders/my-orders");
            setOrders(Array.isArray(response.data?.orders) ? response.data.orders : []);
        } catch (err) {
            console.error(err);
            setOrders([]);
            setError(err.response?.data?.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (loading) return <div className="loading-page">Loading your orders...</div>;

    return (
        <main className="my-orders">
            <section className="page-intro">
                <div>
                    <span className="eyebrow">ACCOUNT</span>
                    <h1>My Orders</h1>
                    <p>Track your purchases and view order details.</p>
                </div>
                <Link className="btn-secondary" to="/products">Continue Shopping</Link>
            </section>

            {error && <div className="error-banner">{error}</div>}

            {!error && orders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🛍</div>
                    <h2>No orders yet</h2>
                    <p>Your completed purchases will appear here.</p>
                    <Link className="btn-primary" to="/products">Start Shopping</Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <article className="order-card" key={order._id}>
                            <div className="order-main">
                                <div className="order-title-row">
                                    <div>
                                        <span className="order-label">ORDER</span>
                                        <h2>#{order._id.slice(-8).toUpperCase()}</h2>
                                    </div>
                                    <span className={`status status-${String(order.status).toLowerCase()}`}>{order.status}</span>
                                </div>
                                <div className="order-meta">
                                    <span>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}</span>
                                    <span>₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                            <Link className="card-link compact" to={`/orders/${order._id}`}>View Order</Link>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default MyOrders;

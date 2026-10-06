import { useCallback, useEffect, useState } from "react";
import API from "../services/api";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await API.get("/orders/admin/all");
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

    const updateStatus = async (orderId, status) => {
        try {
            setError("");
            await API.put(`/orders/admin/${orderId}/status`, { status });
            fetchOrders();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update order status");
        }
    };

    if (loading) return <div className="loading-page">Loading orders...</div>;

    return (
        <main className="admin-orders">
            <section className="page-intro">
                <div>
                    <span className="eyebrow">ADMIN</span>
                    <h1>All Orders</h1>
                    <p>Manage customer orders and delivery status.</p>
                </div>
                <strong className="result-count">{orders.length} orders</strong>
            </section>

            {error && <div className="error-banner">{error}</div>}

            {orders.length === 0 ? (
                <div className="empty-state"><h2>No orders found</h2><p>Orders will appear here after customers checkout.</p></div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <article className="admin-order-card" key={order._id}>
                            <div>
                                <span className="order-label">ORDER #{order._id.slice(-8).toUpperCase()}</span>
                                <h2>{order.user?.name || "Customer"}</h2>
                                <p>{order.user?.email || "No email"}</p>
                                <div className="order-meta"><span>{order.items?.length || 0} items</span><strong>₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</strong></div>
                            </div>
                            <div className="admin-order-status">
                                <span className={`status status-${String(order.status).toLowerCase()}`}>{order.status}</span>
                                <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                                    <option>Pending</option>
                                    <option>Processing</option>
                                    <option>Shipped</option>
                                    <option>Delivered</option>
                                    <option>Cancelled</option>
                                </select>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default AdminOrders;

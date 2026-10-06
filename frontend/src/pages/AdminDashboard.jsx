import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const [productsResponse, ordersResponse] = await Promise.all([
                API.get("/products?limit=50"),
                API.get("/orders/admin/all")
            ]);

            setProducts(Array.isArray(productsResponse.data?.products) ? productsResponse.data.products : []);
            setOrders(Array.isArray(ordersResponse.data?.orders) ? ordersResponse.data.orders : []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) return <div className="loading-page">Loading dashboard...</div>;

    if (error) return <main className="admin-dashboard"><div className="error-banner">{error}</div></main>;

    const pendingOrders = orders.filter((order) => order.status === "Pending").length;
    const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;

    return (
        <main className="admin-dashboard">
            <section className="page-intro">
                <div><span className="eyebrow">ADMIN</span><h1>Dashboard</h1><p>Overview of your ShopHub store.</p></div>
                <Link className="btn-secondary" to="/admin/products">Manage Products</Link>
            </section>

            <div className="dashboard-cards">
                <div className="dashboard-card"><span>Total Products</span><strong>{products.length}</strong></div>
                <div className="dashboard-card"><span>Total Orders</span><strong>{orders.length}</strong></div>
                <div className="dashboard-card"><span>Pending Orders</span><strong>{pendingOrders}</strong></div>
                <div className="dashboard-card"><span>Delivered Orders</span><strong>{deliveredOrders}</strong></div>
            </div>

            <div className="section-heading"><div><h2>Recent Orders</h2><p>Latest customer activity.</p></div><Link className="btn-secondary" to="/admin/orders">View all</Link></div>

            {orders.length === 0 ? (
                <div className="empty-state"><h2>No orders yet</h2><p>Customer orders will appear here.</p></div>
            ) : (
                orders.slice(0, 5).map((order) => (
                    <article className="recent-order" key={order._id}>
                        <h3>#{order._id.slice(-8).toUpperCase()}</h3>
                        <p>{order.user?.name || "Customer"} · ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")} · {order.status}</p>
                    </article>
                ))
            )}
        </main>
    );
}

export default AdminDashboard;

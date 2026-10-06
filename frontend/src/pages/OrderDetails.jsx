import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function OrderDetails() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(
                `/orders/${id}`
            );

            setOrder(response.data.order);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load order"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const cancelOrder = async () => {
        try {
            setError("");

            await API.put(
                `/orders/${id}/cancel`
            );

            alert(
                "Order cancelled successfully"
            );

            fetchOrder();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to cancel order"
            );
        }
    };

    if (loading) {
        return <div className="loading-page">Loading order...</div>;
    }

    if (error && !order) {
        return <div className="loading-page"><p className="error-banner">{error}</p></div>;
    }

    if (!order) {
        return <div className="loading-page">Order not found.</div>;
    }

    return (
        <div className="order-details">

            <button
                onClick={() =>
                    navigate("/my-orders")
                }
            >
                Back to My Orders
            </button>

            <h1>
                Order Details
            </h1>

            <p>
                Order ID: {order._id}
            </p>

            <p>
                Status: {order.status}
            </p>

            <h2>
                Items
            </h2>

            {order.items.map((item) => (

                <div
                    className="order-item"
                    key={item._id}
                >

                    <h3>
                        {item.name}
                    </h3>

                    <p>
                        Price: ₹{item.price}
                    </p>

                    <p>
                        Quantity: {item.quantity}
                    </p>

                    <p>
                        Total: ₹
                        {item.price * item.quantity}
                    </p>

                </div>

            ))}

            <h2>
                Total Amount:
                {" "}
                ₹{order.totalAmount}
            </h2>

            <h2>
                Shipping Address
            </h2>

            <p>
                {order.shippingAddress.fullName}
            </p>

            <p>
                {order.shippingAddress.address}
            </p>

            <p>
                {order.shippingAddress.city}
            </p>

            <p>
                {order.shippingAddress.state}
            </p>

            <p>
                {order.shippingAddress.pincode}
            </p>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {order.status === "Pending" && (

                <button
                    onClick={cancelOrder}
                >
                    Cancel Order
                </button>

            )}

        </div>
    );
}

export default OrderDetails;
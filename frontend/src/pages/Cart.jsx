import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { getImageUrl } from "../services/imageUrl";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await API.get("/cart");
            setCart(response.data.cart);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            await API.put(`/cart/${productId}`, { quantity });
            fetchCart();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update quantity");
        }
    };

    const removeItem = async (productId) => {
        try {
            await API.delete(`/cart/${productId}`);
            fetchCart();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to remove item");
        }
    };

    if (loading) return <div className="loading">Loading your cart...</div>;

    if (error && !cart) return <div className="loading"><p className="error">{error}</p></div>;

    if (!cart || cart.items.length === 0) {
        return (
            <main className="cart">
                <h1>Your Cart</h1>
                <div className="empty-state">
                    <h2>Your cart is empty</h2>
                    <p>Add something you like and come back here.</p>
                    <button className="btn-primary" onClick={() => navigate("/products")}>Continue Shopping</button>
                </div>
            </main>
        );
    }

    return (
        <main className="cart">
            <h1>Your Cart</h1>
            {error && <p className="error">{error}</p>}

            <div className="cart-grid">
                <div>
                    {cart.items.map((item) => (
                        <div className="cart-item" key={item.product._id}>
                            <img src={getImageUrl(item.product.image)} alt={item.product.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/product-placeholder.svg"; }} />
                            <div>
                                <h2>{item.product.name}</h2>
                                <p>₹{Number(item.product.price).toLocaleString("en-IN")} each</p>
                                <div className="cart-qty">
                                    <button disabled={item.quantity <= 1} onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>−</button>
                                    <strong>{item.quantity}</strong>
                                    <button disabled={item.quantity >= item.product.stock} onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                                </div>
                                <p><strong>₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</strong></p>
                                <button className="remove-btn" onClick={() => removeItem(item.product._id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                <aside className="summary-card">
                    <h2>Order Summary</h2>
                    <div className="summary-row"><span>Items</span><span>{cart.items.length}</span></div>
                    <div className="summary-row"><span>Shipping</span><span>Free</span></div>
                    <div className="summary-total"><span>Total</span><span>₹{Number(cart.totalAmount).toLocaleString("en-IN")}</span></div>
                    <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
                </aside>
            </div>
        </main>
    );
}

export default Cart;

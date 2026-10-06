import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Checkout() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: "", address: "", city: "", state: "", pincode: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const update = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!/^[0-9]{6}$/.test(form.pincode)) {
            setError("Please enter a valid 6-digit pincode");
            return;
        }

        try {
            setLoading(true);
            await API.post("/orders", { shippingAddress: form });
            navigate("/my-orders");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="checkout">
            <span className="eyebrow">CHECKOUT</span>
            <h1>Delivery details</h1>
            <p className="page-copy">Enter your shipping address to place your order.</p>
            {error && <div className="error-banner">{error}</div>}
            <div className="checkout-card">
                <form onSubmit={handleSubmit}>
                    <input name="fullName" placeholder="Full name" value={form.fullName} onChange={update} required />
                    <textarea name="address" placeholder="Full address" value={form.address} onChange={update} required />
                    <input name="city" placeholder="City" value={form.city} onChange={update} required />
                    <input name="state" placeholder="State" value={form.state} onChange={update} required />
                    <input name="pincode" inputMode="numeric" maxLength="6" placeholder="6-digit pincode" value={form.pincode} onChange={update} required />
                    <button type="submit" disabled={loading}>{loading ? "Placing order..." : "Place Order"}</button>
                </form>
            </div>
        </main>
    );
}

export default Checkout;
